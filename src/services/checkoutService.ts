import { products, type IProduct } from "./../models/products";
import { promotions } from "./../models/promotions";

export interface ShoppingCartItem {
  sku: string;
  qtd: number;
}

export interface ShoppingCartOutput {
  sku: string;
  qtd: number;
  itemPrice: number; // total price for that sku line
}

export const calculateShoppingCart = (
  items: ShoppingCartItem[]
): ShoppingCartOutput[] => {
  // 1. Build a product lookup.
  const productMap = new Map<string, IProduct>();
  for (const prod of products) {
    productMap.set(prod.sku, prod);
  }

  // 2. Aggregate input items by SKU (only valid SKUs).
  // Instead of silently skipping invalid SKUs, throw an error.
  const counts = new Map<string, number>();
  for (const item of items) {
    if (!productMap.has(item.sku)) {
      throw new Error(`SKU not valid: ${item.sku}`);
    }
    counts.set(item.sku, (counts.get(item.sku) || 0) + item.qtd);
  }

  // We'll accumulate promotion results here.
  // The key is sku and the value is an object with { qtd, total } that we later convert.
  const outputMap = new Map<string, { qtd: number; total: number }>();
  // To mark SKUs that have been handled by some promotion.
  const processedSkus = new Set<string>();

  // 3. Process each promotion.
  promotions.forEach((promo) => {
    const triggerSku = promo.skuTrigger;
    const triggerCount = counts.get(triggerSku);
    // If the promotion’s trigger SKU is not in the cart, we simply skip processing this promotion.
    if (!triggerCount) return;

    if (promo.qtdTrigger === "multiple") {
      if (triggerCount >= promo.skuQtd) {
        const groups = Math.floor(triggerCount / promo.skuQtd);
        const remainder = triggerCount - groups * promo.skuQtd;
        // Process each output defined in the promotion.
        promo.output.forEach((out) => {
          const targetSku = out.skuTarget;
          const targetProd = productMap.get(targetSku)!;
          if (targetSku === triggerSku) {
            // Same-SKU promotion:
            // For complete groups, we pay the discounted price.
            // The remainder is charged at full price.
            const discountedCost =
              groups * promo.skuQtd * targetProd.price * out.priceModifier;
            const fullCost = remainder * targetProd.price;
            outputMap.set(triggerSku, {
              qtd: triggerCount,
              total: discountedCost + fullCost,
            });
            processedSkus.add(triggerSku);
          } else {
            // Cross-SKU promotion.
            // For example, for Mac Pro (trigger) with Raspberry Pi (target):
            // Let freeCount = groups. Then if the user has added target items,
            // discount up to freeCount of them.
            const userCount = counts.get(targetSku) || 0;
            const freeCount = Math.min(groups, userCount);
            if (userCount > 0) {
              // Out of the user-provided target items, freeCount are free.
              const chargeable = userCount - freeCount;
              const total = chargeable * targetProd.price;
              outputMap.set(targetSku, { qtd: userCount, total });
            } else {
              // If the user did not add the target item, add extra free items.
              outputMap.set(targetSku, {
                qtd: groups,
                total: groups * targetProd.price * out.priceModifier,
              });
            }
            processedSkus.add(targetSku);
          }
        });
        processedSkus.add(triggerSku);
      }
    } else if (promo.qtdTrigger === "moreThan") {
      // "moreThan": if the trigger quantity is strictly greater than the threshold,
      // then the discount applies to the entire quantity.
      if (triggerCount > promo.skuQtd) {
        promo.output.forEach((out) => {
          const targetSku = out.skuTarget;
          const targetProd = productMap.get(targetSku)!;
          if (targetSku === triggerSku) {
            const total = triggerCount * targetProd.price * out.priceModifier;
            outputMap.set(triggerSku, { qtd: triggerCount, total });
            processedSkus.add(triggerSku);
          } else {
            // For cross-SKU outputs, similar logic:
            const userCount = counts.get(targetSku) || 0;
            const freeCount = Math.min(triggerCount, userCount);
            if (userCount > 0) {
              const chargeable = userCount - freeCount;
              const total = chargeable * targetProd.price;
              outputMap.set(targetSku, { qtd: userCount, total });
            } else {
              outputMap.set(targetSku, {
                qtd: triggerCount,
                total: triggerCount * targetProd.price * out.priceModifier,
              });
            }
            processedSkus.add(targetSku);
          }
        });
      }
    }
  });

  // 4. For any SKU in the input that was not handled by any promotion, charge at full price.
  counts.forEach((qty, sku) => {
    if (!processedSkus.has(sku)) {
      const prod = productMap.get(sku)!;
      outputMap.set(sku, { qtd: qty, total: qty * prod.price });
    }
  });

  // 5. Convert our results to an array of ShoppingCartOutput, rounding totals to 2 decimals.
  const output: ShoppingCartOutput[] = [];
  outputMap.forEach((val, sku) => {
    output.push({
      sku,
      qtd: val.qtd,
      itemPrice: parseFloat(val.total.toFixed(2)),
    });
  });

  return output;
};

export function sanitizeItems(input: any): ShoppingCartItem[] {
  if (!Array.isArray(input)) {
    throw new Error("Invalid payload: items must be an array.");
  }

  const sanitized: ShoppingCartItem[] = [];

  for (const item of input) {
    if (typeof item.sku !== "string" || item.sku.trim() === "") {
      throw new Error("Each item must have a non-empty sku (string).");
    }
    if (typeof item.qtd !== "number" || item.qtd <= 0) {
      throw new Error("Each item must have a qtd (number) greater than 0.");
    }
    sanitized.push({ sku: item.sku.trim(), qtd: item.qtd });
  }

  return sanitized;
}

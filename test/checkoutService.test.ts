import {
  calculateShoppingCart,
  ShoppingCartOutput,
} from "../src/services/checkoutService";
import { products, type IProduct } from "../src/models/products";

const productsMap = products.reduce((acc, product) => {
  acc[product.sku] = product;
  return acc;
}, {} as Record<string, IProduct>);

const googleHomesPrice = productsMap["120P90"].price; // 49.99
const macBookPrice = productsMap["43N23P"].price; // 5399.99
const raspberryPiPrice = productsMap["344222"].price; // 30.00
const alexaPrice = productsMap["A304SD"].price; // 109.50

describe("Checkout Service", () => {
  describe("Google Homes discount", () => {
    it("Buy 1 Google Home for the price of 1", () => {
      const items = [{ sku: "120P90", qtd: 1 }];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const line = result.find((l) => l.sku === "120P90");
      expect(line).toBeDefined();
      expect(line!.qtd).toBe(1);
      expect(line!.itemPrice).toBeCloseTo(googleHomesPrice, 2);
    });

    it("Buy 2 Google Homes for the price of 2", () => {
      const items = [{ sku: "120P90", qtd: 2 }];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const line = result.find((l) => l.sku === "120P90");
      expect(line).toBeDefined();
      expect(line!.qtd).toBe(2);
      expect(line!.itemPrice).toBeCloseTo(googleHomesPrice * 2, 2);
    });

    it("Buy 3 Google Homes for the price of 2", () => {
      const items = [{ sku: "120P90", qtd: 3 }];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const line = result.find((l) => l.sku === "120P90");
      expect(line).toBeDefined();
      expect(line!.qtd).toBe(3);
      expect(line!.itemPrice).toBeCloseTo(googleHomesPrice * 2, 2);
    });

    it("Buy 4 Google Homes for the price of 3", () => {
      const items = [{ sku: "120P90", qtd: 4 }];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const line = result.find((l) => l.sku === "120P90");
      expect(line).toBeDefined();
      expect(line!.qtd).toBe(4);
      expect(line!.itemPrice).toBeCloseTo(googleHomesPrice * 3, 2);
    });

    it("Buy 6 Google Homes for the price of 4", () => {
      const items = [{ sku: "120P90", qtd: 6 }];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const line = result.find((l) => l.sku === "120P90");
      expect(line).toBeDefined();
      expect(line!.qtd).toBe(6);
      expect(line!.itemPrice).toBeCloseTo(googleHomesPrice * 4, 2);
    });

    it("Buy 6 Google Homes for the price of 4 + 1 Raspberry Pi", () => {
      const items = [
        { sku: "120P90", qtd: 6 },
        { sku: "344222", qtd: 1 },
      ];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const googleLine = result.find((l) => l.sku === "120P90");
      const piLine = result.find((l) => l.sku === "344222");
      expect(googleLine).toBeDefined();
      expect(googleLine!.qtd).toBe(6);
      expect(googleLine!.itemPrice).toBeCloseTo(googleHomesPrice * 4, 2);
      expect(piLine).toBeDefined();
      expect(piLine!.qtd).toBe(1);
      expect(piLine!.itemPrice).toBeCloseTo(raspberryPiPrice, 2);
    });
  });

  describe("Mac Pro discount", () => {
    it("Each sale of a Mac Pro comes with a free Raspberry Pi", () => {
      const items = [{ sku: "43N23P", qtd: 1 }];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const macLine = result.find((l) => l.sku === "43N23P");
      const piLine = result.find((l) => l.sku === "344222");
      expect(macLine).toBeDefined();
      expect(macLine!.qtd).toBe(1);
      expect(macLine!.itemPrice).toBeCloseTo(macBookPrice, 2);
      expect(piLine).toBeDefined();
      expect(piLine!.qtd).toBe(1);
      expect(piLine!.itemPrice).toBe(0);
    });

    it("A sale of Mac Pro and Raspberry Pi should apply 100% discount on Raspberry Pi", () => {
      const items = [
        { sku: "43N23P", qtd: 1 },
        { sku: "344222", qtd: 1 },
      ];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const macLine = result.find((l) => l.sku === "43N23P");
      const piLine = result.find((l) => l.sku === "344222");
      expect(macLine).toBeDefined();
      expect(macLine!.qtd).toBe(1);
      expect(macLine!.itemPrice).toBeCloseTo(macBookPrice, 2);
      expect(piLine).toBeDefined();
      expect(piLine!.qtd).toBe(1);
      expect(piLine!.itemPrice).toBe(0);
    });

    it("A sale of Mac Pro and 2 Raspberry Pi should charge only 1 Raspberry Pi", () => {
      const items = [
        { sku: "43N23P", qtd: 1 },
        { sku: "344222", qtd: 2 },
      ];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const macLine = result.find((l) => l.sku === "43N23P");
      const piLine = result.find((l) => l.sku === "344222");
      expect(macLine).toBeDefined();
      expect(macLine!.qtd).toBe(1);
      expect(macLine!.itemPrice).toBeCloseTo(macBookPrice, 2);
      expect(piLine).toBeDefined();
      expect(piLine!.qtd).toBe(2);
      // Out of the 2 Raspberry Pi, one should be free so total charged = 1 * raspberryPiPrice.
      expect(piLine!.itemPrice).toBeCloseTo(raspberryPiPrice, 2);
    });
  });

  describe("Alexa discount", () => {
    it("Buying 4 Alexa Speakers applies a 10% discount in all", () => {
      const items = [{ sku: "A304SD", qtd: 4 }];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const line = result.find((l) => l.sku === "A304SD");
      expect(line).toBeDefined();
      expect(line!.qtd).toBe(4);
      expect(line!.itemPrice).toBeCloseTo(4 * alexaPrice * 0.9, 2);
    });

    it("Buying 20 Alexa Speakers applies a 10% discount in all", () => {
      const items = [{ sku: "A304SD", qtd: 20 }];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const line = result.find((l) => l.sku === "A304SD");
      expect(line).toBeDefined();
      expect(line!.qtd).toBe(20);
      expect(line!.itemPrice).toBeCloseTo(20 * alexaPrice * 0.9, 2);
    });
  });

  describe("Random Checkout", () => {
    it("Scenario 1: 1 Google Home and 2 Raspberry Pi (no discount)", () => {
      // Expected:
      // - 1 Google Home at full price: 1 * 49.99
      // - 2 Raspberry Pi at full price: 2 * 30.00
      const items = [
        { sku: "120P90", qtd: 1 },
        { sku: "344222", qtd: 2 },
      ];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const googleLine = result.find((l) => l.sku === "120P90");
      const piLine = result.find((l) => l.sku === "344222");
      expect(googleLine).toBeDefined();
      expect(googleLine!.qtd).toBe(1);
      expect(googleLine!.itemPrice).toBeCloseTo(googleHomesPrice, 2);
      expect(piLine).toBeDefined();
      expect(piLine!.qtd).toBe(2);
      expect(piLine!.itemPrice).toBeCloseTo(2 * raspberryPiPrice, 2);
    });

    it("Scenario 2: 1 Google Home, 2 Mac Pro, and 3 Raspberry Pi (should charge only 1 Raspberry Pi)", () => {
      // Expected:
      // - Google Home: 1 * 49.99
      // - Mac Pro: 2 * 5399.99
      // - Raspberry Pi: 3 provided but with 2 free (one per Mac Pro) so only 1 charged: 1 * 30.00
      const items = [
        { sku: "120P90", qtd: 1 },
        { sku: "43N23P", qtd: 2 },
        { sku: "344222", qtd: 3 },
      ];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const googleLine = result.find((l) => l.sku === "120P90");
      const macLine = result.find((l) => l.sku === "43N23P");
      const piLine = result.find((l) => l.sku === "344222");
      expect(googleLine).toBeDefined();
      expect(googleLine!.qtd).toBe(1);
      expect(googleLine!.itemPrice).toBeCloseTo(googleHomesPrice, 2);
      expect(macLine).toBeDefined();
      expect(macLine!.qtd).toBe(2);
      expect(macLine!.itemPrice).toBeCloseTo(2 * macBookPrice, 2);
      expect(piLine).toBeDefined();
      expect(piLine!.qtd).toBe(3);
      // With 2 free Raspberry Pi from Mac Pro promotion, charge = 1 * raspberryPiPrice.
      expect(piLine!.itemPrice).toBeCloseTo(raspberryPiPrice, 2);
    });

    it("Scenario 3: 2 Mac Pro and 10 Alexa Speakers (should add 2 free Raspberry Pi and 10% off on Alexa)", () => {
      // Expected:
      // - Mac Pro: 2 * 5399.99
      // - Automatically add 2 Raspberry Pi free (since none were provided)
      // - Alexa: 10 * 109.50 * 0.9 (discount applies)
      const items = [
        { sku: "43N23P", qtd: 2 },
        { sku: "A304SD", qtd: 10 },
      ];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const macLine = result.find((l) => l.sku === "43N23P");
      const piLine = result.find((l) => l.sku === "344222");
      const alexaLine = result.find((l) => l.sku === "A304SD");
      expect(macLine).toBeDefined();
      expect(macLine!.qtd).toBe(2);
      expect(macLine!.itemPrice).toBeCloseTo(2 * macBookPrice, 2);
      expect(piLine).toBeDefined();
      // Even though the customer didn't add any Raspberry Pi,
      // the promotion automatically adds 2 free Raspberry Pi.
      expect(piLine!.qtd).toBe(2);
      expect(piLine!.itemPrice).toBe(0);
      expect(alexaLine).toBeDefined();
      expect(alexaLine!.qtd).toBe(10);
      expect(alexaLine!.itemPrice).toBeCloseTo(10 * alexaPrice * 0.9, 2);
    });

    it("Scenario 4: Applying all 3 promotions at once", () => {
      // For example:
      // - 3 Google Home (discount applies: price for 2)
      // - 2 Mac Pro (full price) which grant 2 free Raspberry Pi
      // - 5 Alexa Speakers (discount applies: 10% off)
      // Also, assume the customer adds 1 Raspberry Pi.
      // For Raspberry Pi, out of (1 provided + 2 free) the free ones apply to the provided items first.
      // Expected:
      // - Google Home: 3 * => price of 2 = 2 * googleHomesPrice
      // - Mac Pro: 2 * macBookPrice
      // - Raspberry Pi: 1 provided but up to 2 free available, so charged 0.
      // - Alexa: 5 * alexaPrice * 0.9
      const items = [
        { sku: "120P90", qtd: 3 },
        { sku: "43N23P", qtd: 2 },
        { sku: "344222", qtd: 1 },
        { sku: "A304SD", qtd: 5 },
      ];
      const result: ShoppingCartOutput[] = calculateShoppingCart(items);
      const googleLine = result.find((l) => l.sku === "120P90");
      const macLine = result.find((l) => l.sku === "43N23P");
      const piLine = result.find((l) => l.sku === "344222");
      const alexaLine = result.find((l) => l.sku === "A304SD");
      expect(googleLine).toBeDefined();
      expect(googleLine!.qtd).toBe(3);
      expect(googleLine!.itemPrice).toBeCloseTo(googleHomesPrice * 2, 2);
      expect(macLine).toBeDefined();
      expect(macLine!.qtd).toBe(2);
      expect(macLine!.itemPrice).toBeCloseTo(2 * macBookPrice, 2);
      expect(piLine).toBeDefined();
      // 2 free Raspberry Pi available from Mac Pro promotion cover the 1 provided.
      expect(piLine!.qtd).toBe(1);
      expect(piLine!.itemPrice).toBe(0);
      expect(alexaLine).toBeDefined();
      expect(alexaLine!.qtd).toBe(5);
      expect(alexaLine!.itemPrice).toBeCloseTo(5 * alexaPrice * 0.9, 2);
    });
  });
});

export interface IPromotion {
  skuQtd: number;
  qtdTrigger: "multiple" | "moreThan";
  skuTrigger: string;
  output: {
    skuTarget: string;
    priceModifier: number; // between 0 and 1 (Add a Zod schema?)
  }[];
}

export const promotions: IPromotion[] = [
  {
    skuTrigger: "120P90",
    skuQtd: 3,
    output: [{ skuTarget: "120P90", priceModifier: 2 / 3 }],
    qtdTrigger: "multiple",
  },
  {
    skuTrigger: "43N23P",
    skuQtd: 1,
    output: [
      { skuTarget: "43N23P", priceModifier: 1 },
      { skuTarget: "344222", priceModifier: 0 },
    ],
    qtdTrigger: "multiple",
  },
  {
    skuTrigger: "A304SD",
    skuQtd: 3,
    output: [{ skuTarget: "A304SD", priceModifier: 0.9 }],
    qtdTrigger: "moreThan",
  },
];

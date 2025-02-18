export interface IProduct {
  sku: string;
  name: string;
  price: number;
}

export const products: IProduct[] = [
  { sku: "120P90", name: "Google Home", price: 49.99 },
  { sku: "43N23P", name: "Mac Pro", price: 5399.99 },
  { sku: "A304SD", name: "Alexa Speaker", price: 109.5 },
  { sku: "344222", name: "Raspberry Pi", price: 30.0 },
];



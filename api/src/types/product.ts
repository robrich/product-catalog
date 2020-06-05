export interface Product {
  id: number;
  productCode: string;
  name: string;
  desription: string | undefined;
  properties: object;
  active: boolean;
}

export interface Product {
  id: number;
  productCode: string;
  name: string;
  description: string | undefined;
  properties: object;
  active: boolean;
}

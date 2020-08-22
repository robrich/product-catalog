export interface Product {
  id: number;
  productCode: string;
  name: string;
  subtitle?: string | null;
  image?: string | null;
  price: number;
  description?: string | null;
  properties: Record<string, string>;
  active: boolean;
}

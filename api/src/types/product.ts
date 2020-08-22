export interface Product {
  id: number;
  productCode: string;
  name: string;
  subtitle?: string | null;
  image?: string | null;
  price: number;
  description?: string | null;
  properties: object;
  active: boolean;
}

export const productCodeRegex = /^[a-zA-Z0-9\-]+$/;

export const productPropertyRegex = /^[a-zA-Z0-9\- ]+$/;

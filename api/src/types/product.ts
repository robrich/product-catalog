export interface Product {
  id: number;
  productCode: string;
  name: string;
  description: string | undefined;
  properties: object;
  active: boolean;
}

export const productCodeRegex = /^[a-zA-Z0-9\-]+$/;

export const productPropertyRegex = /^[a-zA-Z0-9\- ]+$/;

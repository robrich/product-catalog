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

/*eslint no-useless-escape:0*/
export const productCodeRegex = /^[a-zA-Z0-9\-]+$/;

/*eslint no-useless-escape:0*/
export const productPropertyRegex = /^[a-zA-Z0-9\- ]+$/;

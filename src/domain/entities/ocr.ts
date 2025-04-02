export interface Ocr {
  company: string;
  products: {
    code: number;
    price: number;
  }[];
  text: string;
}

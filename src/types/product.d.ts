import { Category } from './category';

export type ProductStatus = 'active' | 'inactive';
export const ProductStatus: {
  active: 'active';
  inactive: 'inactive';
};

export type Stock = {
  quantity: number;
  updatedAt: Date;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  unitOfMeasure: string;
  status: ProductStatus;
  categoryId: string;
  category: Category;
  stock: Stock;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductCreateInput = Omit<Product, 'id' | 'category' | 'stock' | 'createdAt' | 'updatedAt'> & {
  initialStock?: number;
};
export type ProductUpdateInput = Partial<Omit<ProductCreateInput, 'initialStock' | 'sku'>>;

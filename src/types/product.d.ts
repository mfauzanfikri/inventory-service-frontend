import { Category } from './category';

export type ProductStatus = 'active' | 'inactive';
export const ProductStatus: {
  active: 'active';
  inactive: 'inactive';
};

export type Stock = {
  quantity: number;
  version: number;
  updatedAt: Date;
  updatedBy: string;
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
  version: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
};

export type ProductCreateInput = Omit<Product, 'id' | 'category' | 'stock' | 'createdAt' | 'updatedAt' | 'version' | 'createdBy' | 'updatedBy'> & {
  initialStock?: number;
};
export type ProductUpdateInput = Partial<Omit<ProductCreateInput, 'initialStock' | 'sku'>>;

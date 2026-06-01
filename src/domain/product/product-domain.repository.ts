import { Product, ProductCreateInput, ProductUpdateInput } from "@/types/product";

export type ProductDomainRepository = {
  findAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(data: ProductCreateInput): Promise<Product>;
  update(id: string, data: ProductUpdateInput): Promise<Product | null>;
  delete(id: string): Promise<Product | null>;
  adjustStock(id: string, type: "increase" | "decrease", amount: number): Promise<Product>;
};
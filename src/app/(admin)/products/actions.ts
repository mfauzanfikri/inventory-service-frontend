"use server";

import { productService } from "@/services/product.service";
import { Product, ProductCreateInput, ProductUpdateInput } from "@/types/product";
import { ActionResult } from "@/lib/result/action-result";
import { revalidatePath } from "next/cache";

export async function createProductAction(data: ProductCreateInput): Promise<ActionResult<Product>> {
  const result = await productService.create(data);
  if (result.ok) {
    revalidatePath("/products");
    revalidatePath("/"); // Keep dashboard statistics in sync
  }

  return result;
}

export async function updateProductAction(id: string, data: ProductUpdateInput): Promise<ActionResult<Product>> {
  const result = await productService.update(id, data);
  if (result.ok) {
    revalidatePath("/products");
    revalidatePath("/"); // Keep dashboard statistics in sync
  }

  return result;
}

export async function adjustStockAction(
  id: string,
  type: "increase" | "decrease",
  amount: number
): Promise<ActionResult<Product>> {
  const result = await productService.adjustStock(id, type, amount);
  if (result.ok) {
    revalidatePath("/products");
    revalidatePath("/"); // Keep dashboard statistics in sync
  }

  return result;
}


export async function getProductsAction(): Promise<ActionResult<Product[]>> {
  return productService.list();
}

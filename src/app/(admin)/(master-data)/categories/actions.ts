"use server";

import { categoryService } from "@/services/category.service";
import { CreateCategoryInput, UpdateCategoryInput } from "@/types/category";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(data: CreateCategoryInput) {
  // This runs on the server, so it modifies the server's memory
  const result = await categoryService.create(data);
  
  // Force Next.js to clear the cache and re-render the page
  revalidatePath("/categories"); 
  
  return result;
}

export async function updateCategoryAction(id: string, data: UpdateCategoryInput) {
  const result = await categoryService.update(id, data);
  revalidatePath("/categories");
  return result;
}

export async function deleteCategoryAction(id: string) {
  await categoryService.delete(id);
  revalidatePath("/categories");
}

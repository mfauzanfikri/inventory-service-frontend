"use server";

import { categoryService } from "@/services/category.service";
import { CategoryCreateInput, CategoryUpdateInput } from "@/types/category";
import { ActionResult } from "@/lib/result/action-result";
import { Category } from "@/types/category";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(data: CategoryCreateInput): Promise<ActionResult<Category>> {
  const result = await categoryService.create(data);
  if(result.ok) {
    revalidatePath("/categories");
  }

  return result;
}

export async function updateCategoryAction(id: string, data: CategoryUpdateInput): Promise<ActionResult<Category>> {
  const result = await categoryService.update(id, data);
  if(result.ok) {
    revalidatePath("/categories");
  }

  return result;
}



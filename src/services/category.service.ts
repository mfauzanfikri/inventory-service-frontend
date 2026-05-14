import { Category } from "@/types/category";
import { getAllCategories } from "@/repositories/category.repository";

export async function getCategories(): Promise<Category[]> {
  return getAllCategories();
}

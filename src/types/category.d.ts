export type Category = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
}

export type CategoryCreateInput = Omit<Category, "id">

export type CategoryUpdateInput = Partial<CategoryCreateInput>
export type Category = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
}

export type CreateCategoryInput = Omit<Category, "id">

export type UpdateCategoryInput = Partial<CreateCategoryInput>
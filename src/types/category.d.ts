export type Category = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export type CategoryCreateInput = Omit<Category, "id" | "createdAt" | "updatedAt">

export type CategoryUpdateInput = Partial<CategoryCreateInput>
export type Category = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export type CategoryCreateInput = Omit<Category, "id" | "createdAt" | "updatedAt"> & {
  description?: string
}

export type CategoryUpdateInput = Partial<CategoryCreateInput>
export type Category = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  version: number
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

export type CategoryCreateInput = Omit<Category, "id" | "createdAt" | "updatedAt" | "version" | "createdBy" | "updatedBy"> & {
  description?: string
}

export type CategoryUpdateInput = Partial<CategoryCreateInput>
import { Category } from "@/types/category";
import { CategoryName } from "./category-name";
import { CategoryDescription } from "./category-description";

export class CategoryEntity {
  private constructor(private readonly props: Category) {}

  static create(props: Category): CategoryEntity {
    CategoryName.create(props.name);
    CategoryDescription.create(props.description);

    if(props.status !== "active" && props.status !== "inactive") {
      throw new Error("Category status is invalid");
    }

    return new CategoryEntity(props);
  }

  toJSON(): Category {
    return { ...this.props };
  }
}

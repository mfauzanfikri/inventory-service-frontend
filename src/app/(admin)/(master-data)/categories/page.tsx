import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categoryService } from "@/services/category.service";
import { CategoryTable } from "./category-table";

export const metadata: Metadata = {
  title: "Categories",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const data = await categoryService.getAll();

  return (
    <div>
      <PageBreadcrumb pageTitle="Categories" />

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>

        <CardContent>
          <CategoryTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
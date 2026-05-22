import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { categoryService } from "@/services/category.service";
import { CategoryTable } from "./_components/category-table";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  const result = await categoryService.list();
  const data = result.ok ? result.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="Categories" />

      <Card>
        <CardContent>
          <CategoryTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
}

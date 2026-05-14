import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/(admin)/(master-data)/categories/columns";
import { AddCategoryModal } from "@/app/(admin)/(master-data)/categories/add-category-modal";
import { getCategories } from "@/services/category.service";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function Categories() {
  const data = await getCategories();

  return (
    <div>
      <PageBreadcrumb pageTitle="Categories" />

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto">
            <div className="flex justify-end mb-1">
              <AddCategoryModal />
            </div>
            <DataTable columns={columns} data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

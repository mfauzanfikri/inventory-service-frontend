import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { ProductTable } from "./_components/product-table";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  const [productsResult, categoriesResult] = await Promise.all([
    productService.list(),
    categoryService.list(),
  ]);

  const products = productsResult.ok ? productsResult.data : [];
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  return (
    <div>
      <PageBreadcrumb pageTitle="Products" />

      <Card className="p-6">
        <CardContent className="p-0">
          <ProductTable products={products} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}

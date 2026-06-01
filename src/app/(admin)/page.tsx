import { productService } from "@/services/product.service";
import { DashboardClient } from "./dashboard-client";

export const metadata = {
  title: "Inventory Dashboard",
};

export default async function InventoryDashboardPage() {
  const result = await productService.list();
  const products = result.ok ? result.data : [];

  return <DashboardClient initialProducts={products} />;
}

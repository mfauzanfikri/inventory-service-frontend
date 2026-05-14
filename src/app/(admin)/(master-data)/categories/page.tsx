import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/(admin)/(master-data)/categories/columns";
import { Category } from "@/types/category";
import { AddCategoryModal } from "@/app/(admin)/(master-data)/categories/add-category-modal";

export const metadata: Metadata = {
  title: "Categories",
};

async function getData(): Promise<Category[]> {
  const categories = [
    ["Electronics", "Devices and electronic items"],
    ["Furniture", "Home and office furniture"],
    ["Stationery", "Office supplies and stationery items"],
    ["Groceries", "Daily household consumables"],
    ["Clothing", "Apparel and fashion items"],
    ["Automotive", "Vehicle parts and accessories"],
    ["Books", "Printed books and reading materials"],
    ["Sports", "Sports equipment and fitness gear"],
    ["Beauty", "Beauty and personal care products"],
    ["Toys", "Toys, games, and hobby items"],
    ["Kitchenware", "Cooking tools and kitchen supplies"],
    ["Garden", "Gardening tools and outdoor supplies"],
    ["Hardware", "Tools, fasteners, and repair supplies"],
    ["Health", "Health care and wellness products"],
    ["Pet Supplies", "Food and accessories for pets"],
    ["Baby Products", "Baby care and nursery essentials"],
    ["Footwear", "Shoes, sandals, and related accessories"],
    ["Jewelry", "Jewelry and fashion accessories"],
    ["Music", "Musical instruments and audio accessories"],
    ["Office Equipment", "Office machines and workplace equipment"],
    ["Cleaning", "Cleaning products and sanitation supplies"],
    ["Beverages", "Drinks and beverage supplies"],
    ["Snacks", "Packaged snacks and light food items"],
    ["Frozen Foods", "Frozen meals and refrigerated goods"],
    ["Bakery", "Bread, cakes, and bakery products"],
    ["Dairy", "Milk, cheese, and dairy products"],
    ["Meat", "Fresh and packaged meat products"],
    ["Seafood", "Fish, shellfish, and seafood products"],
    ["Produce", "Fresh fruit and vegetables"],
    ["Pharmacy", "Medicine and pharmacy supplies"],
    ["Travel", "Travel bags and trip accessories"],
    ["Luggage", "Suitcases and storage bags"],
    ["Mobile Accessories", "Phone cases, chargers, and cables"],
    ["Computer Accessories", "Keyboards, mice, and computer peripherals"],
    ["Networking", "Routers, switches, and network equipment"],
    ["Cameras", "Cameras and photography accessories"],
    ["Gaming", "Gaming consoles and accessories"],
    ["Lighting", "Lamps, bulbs, and lighting fixtures"],
    ["Bedding", "Sheets, pillows, and bedding sets"],
    ["Bathroom", "Bathroom fixtures and accessories"],
    ["Decor", "Home decoration and interior accents"],
    ["Storage", "Boxes, shelves, and storage organizers"],
    ["Safety", "Safety equipment and protective gear"],
    ["Industrial", "Industrial tools and materials"],
    ["Packaging", "Boxes, wraps, and packaging supplies"],
    ["Paper Goods", "Paper products and disposable supplies"],
    ["Art Supplies", "Paint, brushes, and creative materials"],
    ["Crafts", "Crafting tools and hobby supplies"],
    ["Seasonal", "Seasonal decorations and event items"],
    ["Gifts", "Gift items and special occasion products"],
  ];

  return categories.map(([name, description], index) => ({
    id: `category-${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    status: index % 5 === 0 ? "inactive" : "active",
  }));
}

export default async function Categories() {
  const data = await getData();

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

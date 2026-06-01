import { Category, CategoryCreateInput, CategoryUpdateInput } from "@/types/category";
import { CategoryDomainRepository } from "@/domain/category";

const globalForCategories = globalThis as unknown as { mockCategories: Category[] };

let categories: Category[] = globalForCategories.mockCategories || [
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
].map(([name, description], index) => ({
  id: `category-${String(index + 1).padStart(2, "0")}`,
  name,
  description,
  status: index % 5 === 0 ? "inactive" : "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

if(process.env.NODE_ENV !== "production") {
  globalForCategories.mockCategories = categories;
}

function createConflictError(message: string): Error & { status: number } {
  const error = new Error(message) as Error & { status: number };
  error.status = 409;
  return error;
}

async function findAll(): Promise<Category[]> {
  return [...categories].reverse();
}

async function findByName(name: string): Promise<Category | null> {
  const category = categories.find((value) => value.name === name);
  return category ?? null;
}

async function create(data: CategoryCreateInput): Promise<Category> {
  if(categories.some((category) => category.name === data.name)) {
    throw createConflictError(`Category with name ${data.name} already exists`);
  }

  const newCategory: Category = {
    id: `category-${String(categories.length + 1).padStart(2, "0")}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  categories.push(newCategory);
  return newCategory;
}

async function update(id: string, data: CategoryUpdateInput): Promise<Category | null> {
  const index = categories.findIndex((category) => category.id === id);
  if(index === -1) {
    return null;
  }

  if(data.name && categories.some((category) => category.id !== id && category.name === data.name)) {
    throw createConflictError(`Category with name ${data.name} already exists`);
  }

  categories[index] = {
    ...categories[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return categories[index];
}

export function createInMemoryCategoryRepository(): CategoryDomainRepository {
  return {
    findAll,
    findByName,
    create,
    update,
  };
}

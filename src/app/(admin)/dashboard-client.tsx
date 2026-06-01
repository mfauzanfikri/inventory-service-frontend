"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, CheckCircle, Package, ArrowRight, Eye, RotateCw } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/product";
import { getProductsAction } from "./products/actions";
import { toast } from "sonner";

interface DashboardClientProps {
  initialProducts: Product[];
}

export function DashboardClient({ initialProducts }: DashboardClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Set the initial sync timestamp on client mount
  useEffect(() => {
    setLastSynced(new Date());
  }, []);

  const handleRefresh = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const result = await getProductsAction();
      if (result.ok) {
        setProducts(result.data);
        setLastSynced(new Date());
        if (!silent) {
          toast.success("Dashboard metrics updated successfully");
        }
      } else {
        console.error("Failed to fetch dashboard data:", result.error);
        if (!silent) {
          toast.error(result.error.message || "Failed to update dashboard metrics");
        }
      }
    } catch (err) {
      console.error("Error polling dashboard data:", err);
      if (!silent) {
        toast.error("An unexpected error occurred during sync");
      }
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  // 1 minute auto polling
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh(true); // silent background fetch
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const outOfStockProducts = products.filter(p => (p.stock?.quantity ?? 0) === 0);
  const lowStockProducts = products.filter(p => {
    const qty = p.stock?.quantity ?? 0;
    return qty > 0 && qty <= 5;
  });

  const totalOutOfStock = outOfStockProducts.length;
  const totalLowStock = lowStockProducts.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory Overview</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          {lastSynced && (
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md font-medium border border-border">
              Synced: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          
          <button
            onClick={() => handleRefresh(false)}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold shadow-xs hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 select-none cursor-pointer"
          >
            <RotateCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Syncing..." : "Reload"}
          </button>
          
          <Link 
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/95 transition-all"
          >
            Manage Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Products</p>
              <h3 className="text-2xl font-bold tracking-tight">{totalProducts}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Active Products */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-green-50 p-3 text-green-600 dark:bg-green-950/20 dark:text-green-400">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Items</p>
              <h3 className="text-2xl font-bold tracking-tight">{activeProducts}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Out of Stock Warning */}
        <Card className="hover:shadow-md transition-shadow border-red-100 dark:border-red-950/30">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-lg p-3 ${
              totalOutOfStock > 0 
                ? "bg-red-100 text-red-700 animate-pulse dark:bg-red-950/40 dark:text-red-400" 
                : "bg-red-50 text-red-500 dark:bg-red-950/10 dark:text-red-500"
            }`}>
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
              <h3 className={`text-2xl font-bold tracking-tight ${totalOutOfStock > 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                {totalOutOfStock}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Warning */}
        <Card className="hover:shadow-md transition-shadow border-amber-100 dark:border-amber-950/30">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-lg p-3 ${
              totalLowStock > 0 
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" 
                : "bg-amber-50 text-amber-500 dark:bg-amber-950/10 dark:text-amber-500"
            }`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock (&le; 5)</p>
              <h3 className={`text-2xl font-bold tracking-tight ${totalLowStock > 0 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                {totalLowStock}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Warnings split layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Out of Stock Feed */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Critical: Out of Stock Alerts ({totalOutOfStock})
            </CardTitle>
            <span className="text-xs text-muted-foreground font-medium text-red-500">Action needed</span>
          </CardHeader>
          <CardContent className="p-0">
            {totalOutOfStock === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">All items have active stock counts.</p>
              </div>
            ) : (
              <div className="divide-y max-h-[300px] overflow-y-auto">
                {outOfStockProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {p.sku} | Category: {p.category?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400">
                        0 {p.unitOfMeasure}
                      </span>
                      <Link
                        href="/products"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Warning Feed */}
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Warnings ({totalLowStock})
            </CardTitle>
            <span className="text-xs text-muted-foreground font-medium text-amber-500">&le; 5 units</span>
          </CardHeader>
          <CardContent className="p-0">
            {totalLowStock === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">No low-stock item warnings.</p>
              </div>
            ) : (
              <div className="divide-y max-h-[300px] overflow-y-auto">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {p.sku} | Category: {p.category?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400">
                        {p.stock?.quantity} {p.unitOfMeasure}
                      </span>
                      <Link
                        href="/products"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Safe locks disclaimer footnote */}
      <Card>
        <CardContent className="p-4 text-xs text-muted-foreground leading-normal">
          <strong>Security Disclaimer:</strong> This overview reflects real-time stock levels. Stock decrements are handled via single-statement atomic transactions using row locks on PostgreSQL. Decreasing stock below zero is prevented at the database layer to safeguard against concurrent ordering race-conditions.
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adjustStockAction } from "../actions";
import { AlertTriangle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const schema = z.object({
  type: z.enum(["increase", "decrease"]),
  amount: z.number().int().min(1, "Adjustment amount must be at least 1"),
});

type FormData = z.infer<typeof schema>;

interface AdjustStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function AdjustStockModal({ open, onOpenChange, product }: AdjustStockModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setError,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "increase",
      amount: 1,
    },
  });

  const watchType = watch("type");
  const watchAmount = watch("amount") ?? 0;

  useEffect(() => {
    if (product && open) {
      reset({
        type: "increase",
        amount: 1,
      });
    }
  }, [product, open, reset]);

  if (!product) return null;

  const onSubmit = async (data: FormData) => {
    const result = await adjustStockAction(product.id, data.type, data.amount);

    if (!result.ok) {
      // Catch insufficient stock validation errors from backend
      if (result.error.field === "quantity") {
        setError("amount", { message: result.error.message });
        return;
      }

      toast.error(result.error.message || "Failed to adjust stock. Please try again.", {
        position: "top-center",
      });
      return;
    }

    const directionText = data.type === "increase" ? "increased" : "decreased";
    toast.success(
      <span>
        Stock of <b className="font-bold">{product.name}</b> has been {directionText} by {data.amount}. Total now: {result.data.stock?.quantity ?? 0}
      </span>,
      { position: "top-center" }
    );

    onOpenChange(false);
  };

  const currentStock = product.stock?.quantity ?? 0;
  const isNumberAmount = typeof watchAmount === "number" && !isNaN(watchAmount);
  const previewStock = isNumberAmount
    ? watchType === "increase"
      ? currentStock + watchAmount
      : currentStock - watchAmount
    : currentStock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Adjust Stock Levels</DialogTitle>
            <DialogDescription>
              Adjust physical stock counts for <span className="font-semibold text-foreground">{product.name}</span>.
            </DialogDescription>
          </DialogHeader>

          {/* Dynamic adjustment preview card */}
          <div className="my-4 rounded-lg border border-border bg-card p-4 text-sm space-y-3 shadow-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>SKU:</span>
              <span className="font-medium text-foreground">{product.sku}</span>
            </div>

            <div className="flex justify-between items-center text-muted-foreground">
              <span>Current Stock:</span>
              <span className="font-semibold text-foreground">{currentStock} {product.unitOfMeasure}</span>
            </div>

            <div className="flex justify-between items-center text-muted-foreground border-t pt-2 border-dashed">
              <span>Expected Result:</span>
              <span className={`font-semibold ${
                previewStock < 0 
                  ? "text-red-600 dark:text-red-400" 
                  : "text-green-600 dark:text-green-400 font-bold"
              }`}>
                {previewStock} {product.unitOfMeasure}
                {previewStock < 0 && (
                  <span className="block text-[10px] text-red-500 font-normal mt-0.5">
                    Warning: Stock will fall below zero (will be rejected by server)
                  </span>
                )}
              </span>
            </div>

            {/* Concurrent User Caution warning */}
            <div className="flex gap-2 rounded-md bg-amber-50/50 p-2.5 text-xs text-amber-800 border border-amber-200 dark:bg-amber-950/10 dark:text-amber-400 dark:border-amber-900/30">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
              <p className="leading-normal">
                <strong>Concurrent Warning:</strong> The final stock result may differ if other users make adjustments simultaneously. Safe, concurrent decrements are guaranteed via database row-level locking.
              </p>
            </div>
          </div>

          <FieldGroup className="py-2 space-y-4">
            {/* Adjustment Action Radio Selector using Shadcn Component */}
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Adjustment Action</FieldLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-2 gap-3 mt-1.5"
                  >
                    <label
                      htmlFor="adjust-increase"
                      className={`flex items-center justify-start gap-3 rounded-lg border p-3 cursor-pointer transition-all hover:bg-muted/50 select-none ${
                        field.value === "increase"
                          ? "border-green-600 bg-green-50/50 text-green-700 font-medium dark:bg-green-950/20 dark:text-green-400"
                          : "border-input"
                      }`}
                    >
                      <RadioGroupItem value="increase" id="adjust-increase" className="text-green-600 border-green-600 focus-visible:ring-green-500/50" />
                      <span className="text-sm font-medium">Increase Stock (+)</span>
                    </label>

                    <label
                      htmlFor="adjust-decrease"
                      className={`flex items-center justify-start gap-3 rounded-lg border p-3 cursor-pointer transition-all hover:bg-muted/50 select-none ${
                        field.value === "decrease"
                          ? "border-red-600 bg-red-50/50 text-red-700 font-medium dark:bg-red-950/20 dark:text-red-400"
                          : "border-input"
                      }`}
                    >
                      <RadioGroupItem value="decrease" id="adjust-decrease" className="text-red-600 border-red-600 focus-visible:ring-red-500/50" />
                      <span className="text-sm font-medium">Decrease Stock (-)</span>
                    </label>
                  </RadioGroup>
                </Field>
              )}
            />

            {/* Quantity Input */}
            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="adjust-amount">Adjustment Amount</FieldLabel>
              <Input
                id="adjust-amount"
                type="number"
                min="1"
                placeholder="e.g. 5"
                {...register("amount", { valueAsNumber: true })}
                aria-invalid={!!errors.amount}
              />
              {errors.amount && <FieldError>{errors.amount.message}</FieldError>}
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner /> Processing
                </>
              ) : (
                "Apply Adjustment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
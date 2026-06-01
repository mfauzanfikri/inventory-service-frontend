import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddProductModal } from "../add-product-modal";
import { createProductAction } from "../../actions";
import { toast } from "sonner";

jest.mock("../../actions", () => ({
  createProductAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AddProductModal", () => {
  const mockCategories = [
    {
      id: "cat-1",
      name: "Electronics",
      description: "Devices",
      status: "active" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-2",
      name: "Books",
      description: "Reading",
      status: "inactive" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the trigger button", () => {
    render(<AddProductModal categories={mockCategories} />);
    expect(screen.getByRole("button", { name: /add product/i })).toBeInTheDocument();
  });

  it("opens the modal when trigger is clicked", async () => {
    render(<AddProductModal categories={mockCategories} />);
    const trigger = screen.getByRole("button", { name: /add product/i });
    fireEvent.click(trigger);

    expect(
      await screen.findByText(/register a new product with category details and optional initial inventory/i)
    ).toBeInTheDocument();
  });

  it("validates mandatory fields", async () => {
    render(<AddProductModal categories={mockCategories} />);
    fireEvent.click(screen.getByRole("button", { name: /add product/i }));

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    expect(await screen.findByText(/product name must be at least 3 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/sku is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/unit of measure is required/i)).toBeInTheDocument();
  });

  it("only lists active categories inside the selection dropdown", async () => {
    render(<AddProductModal categories={mockCategories} />);
    fireEvent.click(screen.getByRole("button", { name: /add product/i }));

    const selectTrigger = screen.getByRole("combobox", { name: /category/i });
    fireEvent.click(selectTrigger);

    // Electronics is active -> should be present
    expect(screen.getByRole("option", { name: /electronics/i })).toBeInTheDocument();
    // Books is inactive -> should not be listed
    expect(screen.queryByRole("option", { name: /books/i })).not.toBeInTheDocument();
  });

  it("calls createProductAction with correct payload on valid submit", async () => {
    const mockCreatedProduct = {
      id: "prod-1",
      name: "Acme Watch",
      sku: "ACME-01",
      unitOfMeasure: "pcs",
      status: "active",
      categoryId: "cat-1",
    };
    (createProductAction as jest.Mock).mockResolvedValue({ ok: true, data: mockCreatedProduct });

    render(<AddProductModal categories={mockCategories} />);
    fireEvent.click(screen.getByRole("button", { name: /add product/i }));

    fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: "Acme Watch" } });
    fireEvent.change(screen.getByLabelText(/^sku$/i), { target: { value: "ACME-01" } });
    fireEvent.change(screen.getByLabelText(/unit of measure/i), { target: { value: "pcs" } });
    fireEvent.change(screen.getByLabelText(/initial stock quantity/i), { target: { value: "15" } });

    const selectTrigger = screen.getByRole("combobox", { name: /category/i });
    fireEvent.click(selectTrigger);
    fireEvent.click(screen.getByRole("option", { name: /electronics/i }));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(createProductAction).toHaveBeenCalledWith({
        name: "Acme Watch",
        sku: "ACME-01",
        unitOfMeasure: "pcs",
        initialStock: 15,
        status: "active",
        categoryId: "cat-1",
      });
    });

    expect(toast.success).toHaveBeenCalled();
  });
});

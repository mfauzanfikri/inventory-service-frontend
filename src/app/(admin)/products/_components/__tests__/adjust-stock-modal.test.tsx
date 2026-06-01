import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AdjustStockModal } from "../adjust-stock-modal";
import { adjustStockAction } from "../../actions";
import { toast } from "sonner";
import * as React from "react";

// Mock Radix UI selectively: use React Context to propagate values down to nested children, mimicking Radix natively
jest.mock("radix-ui", () => {
  const actualRadix = jest.requireActual("radix-ui");
  const ReactMock = require("react");
  
  const RadioGroupContext = ReactMock.createContext({
    value: undefined,
    onValueChange: undefined,
  });
  
  const RadioGroupRoot = ({ children, value, onValueChange, className, ...props }: any) => {
    return ReactMock.createElement(
      RadioGroupContext.Provider,
      { value: { value, onValueChange } },
      ReactMock.createElement(
        "div",
        { 
          "data-testid": "radix-radio-group", 
          className, 
          ...props 
        },
        children
      )
    );
  };

  const RadioGroupItem = ({ value, id, className, children, ...props }: any) => {
    const ctx = ReactMock.useContext(RadioGroupContext);
    const isChecked = ctx.value === value;
    
    return ReactMock.createElement(
      "div",
      {
        className: "flex items-center",
        style: { display: "inline-flex" }
      },
      // Invisible real radio input bound to the ID so getByLabelText works natively for descriptive accessibility checks
      ReactMock.createElement("input", {
        type: "radio",
        id,
        value,
        name: "adjust-type-test",
        checked: isChecked,
        onChange: () => ctx.onValueChange?.(value),
        style: { opacity: 0, position: "absolute", width: 0, height: 0 }
      }),
      // Styled button representing the custom check widget that can have nested children indicators
      ReactMock.createElement(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": isChecked,
          onClick: () => ctx.onValueChange?.(value),
          "data-testid": `radio-item-${value}`,
          className,
          ...props
        },
        children
      )
    );
  };

  const Indicator = ({ children }: any) => children || null;

  return {
    ...actualRadix, // Preserves Dialog, Select, and all other actual exports!
    RadioGroup: {
      Root: RadioGroupRoot,
      Item: RadioGroupItem,
      Indicator,
    }
  };
});

jest.mock("../../actions", () => ({
  adjustStockAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AdjustStockModal", () => {
  const mockProduct = {
    id: "prod-1",
    name: "Smart Watch",
    sku: "WATCH-01",
    unitOfMeasure: "pcs",
    status: "active" as const,
    categoryId: "cat-1",
    category: {
      id: "cat-1",
      name: "Electronics",
      description: "Tech",
      status: "active" as const,
      createdAt: "",
      updatedAt: "",
    },
    stock: {
      quantity: 10,
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const onOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <AdjustStockModal open={false} onOpenChange={onOpenChange} product={mockProduct} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders correct title, SKU, and current stock level when opened", () => {
    render(<AdjustStockModal open={true} onOpenChange={onOpenChange} product={mockProduct} />);

    expect(screen.getByText(/Adjust Stock Levels/i)).toBeInTheDocument();
    expect(screen.getByText("WATCH-01")).toBeInTheDocument();
    expect(screen.getByText("10 pcs")).toBeInTheDocument();
  });

  it("calculates and displays expected results dynamically in real-time", async () => {
    render(<AdjustStockModal open={true} onOpenChange={onOpenChange} product={mockProduct} />);

    // Default: Increase, Amount: 1. Expected Result: 10 + 1 = 11 pcs
    expect(screen.getByText("11 pcs")).toBeInTheDocument();

    // Type in 5 as the new amount
    const amountInput = screen.getByLabelText(/adjustment amount/i);
    fireEvent.change(amountInput, { target: { value: "5" } });

    // Expected Result: 10 + 5 = 15 pcs
    expect(screen.getByText("15 pcs")).toBeInTheDocument();
  });

  it("calculates expected decrement results and flags negative warnings", async () => {
    render(<AdjustStockModal open={true} onOpenChange={onOpenChange} product={mockProduct} />);

    // Select Decrease action tab button by its explicit TestID
    const decreaseRadio = screen.getByTestId("radio-item-decrease");
    fireEvent.click(decreaseRadio);

    // Expected Result: 10 - 1 = 9 pcs
    expect(screen.getByText("9 pcs")).toBeInTheDocument();

    // Type in 15 as the amount (which exceeds 10)
    const amountInput = screen.getByLabelText(/adjustment amount/i);
    fireEvent.change(amountInput, { target: { value: "15" } });

    // Expected Result: 10 - 15 = -5 pcs
    expect(screen.getByText("-5 pcs")).toBeInTheDocument();
    // Warning label should show up
    expect(screen.getByText(/Warning: Stock will fall below zero/i)).toBeInTheDocument();
  });

  it("calls adjustStockAction on valid submit and fires success toast", async () => {
    const adjustedProduct = {
      ...mockProduct,
      stock: { quantity: 15, updatedAt: new Date() },
    };
    (adjustStockAction as jest.Mock).mockResolvedValue({ ok: true, data: adjustedProduct });

    render(<AdjustStockModal open={true} onOpenChange={onOpenChange} product={mockProduct} />);

    const amountInput = screen.getByLabelText(/adjustment amount/i);
    fireEvent.change(amountInput, { target: { value: "5" } });

    fireEvent.click(screen.getByRole("button", { name: /apply adjustment/i }));

    await waitFor(() => {
      expect(adjustStockAction).toHaveBeenCalledWith("prod-1", "increase", 5);
    });

    expect(toast.success).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("displays inline field errors if backend rejects stock decrement", async () => {
    (adjustStockAction as jest.Mock).mockResolvedValue({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Cannot decrease stock: Insufficient stock levels",
        category: "domain",
        field: "quantity",
      },
    });

    render(<AdjustStockModal open={true} onOpenChange={onOpenChange} product={mockProduct} />);

    // Select Decrease action tab button by its explicit TestID
    const decreaseRadio = screen.getByTestId("radio-item-decrease");
    fireEvent.click(decreaseRadio);

    const amountInput = screen.getByLabelText(/adjustment amount/i);
    fireEvent.change(amountInput, { target: { value: "15" } });

    fireEvent.click(screen.getByRole("button", { name: /apply adjustment/i }));

    // Expect the custom catch block to trigger setError on the 'amount' field
    expect(await screen.findByText(/Cannot decrease stock: Insufficient stock levels/i)).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

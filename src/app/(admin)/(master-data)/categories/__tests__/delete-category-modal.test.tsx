import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteCategoryModal } from '../delete-category-modal';
import { deleteCategoryAction } from '../actions';
import { Category } from '@/types/category';

// Mock the server action
jest.mock('../actions', () => ({
  deleteCategoryAction: jest.fn(),
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('DeleteCategoryModal', () => {
  const mockCategory: Category = {
    id: 'test-1',
    name: 'Electronics',
    description: 'Tech things',
    status: 'active',
  };

  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when category is null', () => {
    const { container } = render(
      <DeleteCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render confirmation message with category name', () => {
    render(
      <DeleteCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={mockCategory}
      />
    );

    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    expect(screen.getByText(mockCategory.name)).toBeInTheDocument();
  });

  it('should call deleteCategoryAction when delete button is clicked', async () => {
    render(
      <DeleteCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={mockCategory}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteCategoryAction).toHaveBeenCalledWith(mockCategory.id);
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should call onOpenChange(false) when cancel button is clicked', () => {
    render(
      <DeleteCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={mockCategory}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(deleteCategoryAction).not.toHaveBeenCalled();
  });
});

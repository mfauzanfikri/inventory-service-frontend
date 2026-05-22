import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteCategoryModal } from '../delete-category-modal';
import { deleteCategoryAction } from '../../actions';
import { Category } from '@/types/category';
import { toast } from 'sonner';

jest.mock('../../actions', () => ({
  deleteCategoryAction: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
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

  it('should call deleteCategoryAction when delete button is clicked', async () => {
    (deleteCategoryAction as jest.Mock).mockResolvedValue({ ok: true, data: undefined });

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

  it('should show error toast if deletion fails', async () => {
    (deleteCategoryAction as jest.Mock).mockResolvedValue({
      ok: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to delete category. Please try again.',
        category: 'unknown',
      },
    });

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
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to delete category'),
        expect.any(Object)
      );
    });
  });
});

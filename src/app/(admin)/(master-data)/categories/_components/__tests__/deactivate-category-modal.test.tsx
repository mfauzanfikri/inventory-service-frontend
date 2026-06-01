import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeactivateCategoryModal } from '../deactivate-category-modal';
import { updateCategoryAction } from '../../actions';
import { Category } from '@/types/category';
import { toast } from 'sonner';

jest.mock('../../actions', () => ({
  updateCategoryAction: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('DeactivateCategoryModal', () => {
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
      <DeactivateCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should call updateCategoryAction with status inactive when deactivate button is clicked', async () => {
    (updateCategoryAction as jest.Mock).mockResolvedValue({ ok: true, data: undefined });

    render(
      <DeactivateCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={mockCategory}
      />
    );

    const deactivateButton = screen.getByRole('button', { name: /deactivate/i });
    fireEvent.click(deactivateButton);

    await waitFor(() => {
      expect(updateCategoryAction).toHaveBeenCalledWith(mockCategory.id, { status: "inactive" });
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should show error toast if deactivation fails', async () => {
    (updateCategoryAction as jest.Mock).mockResolvedValue({
      ok: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to deactivate category. Please try again.',
        category: 'unknown',
      },
    });

    render(
      <DeactivateCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={mockCategory}
      />
    );

    const deactivateButton = screen.getByRole('button', { name: /deactivate/i });
    fireEvent.click(deactivateButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to deactivate category'),
        expect.any(Object)
      );
    });
  });
});

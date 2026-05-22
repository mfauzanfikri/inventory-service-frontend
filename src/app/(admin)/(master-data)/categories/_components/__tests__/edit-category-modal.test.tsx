import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditCategoryModal } from '../edit-category-modal';
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

describe('EditCategoryModal', () => {
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
      <EditCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={null}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render with category data when open', () => {
    render(
      <EditCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={mockCategory}
      />
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue(mockCategory.name);
    expect(screen.getByLabelText(/description/i)).toHaveValue(mockCategory.description);
    expect(screen.getByRole('combobox')).toHaveTextContent(/active/i);
  });

  it('should call updateCategoryAction with only dirty fields', async () => {
    (updateCategoryAction as jest.Mock).mockResolvedValue({ ok: true, data: mockCategory });

    render(
      <EditCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={mockCategory}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Electronics' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateCategoryAction).toHaveBeenCalledWith(mockCategory.id, {
        name: 'Updated Electronics',
      });
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should show error toast if update fails', async () => {
    (updateCategoryAction as jest.Mock).mockResolvedValue({
      ok: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to update category. Please try again.',
        category: 'unknown',
      },
    });

    render(
      <EditCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={mockCategory}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Electronics' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to update category'),
        expect.any(Object)
      );
    });
  });
});

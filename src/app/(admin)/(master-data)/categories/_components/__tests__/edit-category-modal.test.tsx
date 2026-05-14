import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditCategoryModal } from '../edit-category-modal';
import { updateCategoryAction } from '../../actions';
import { Category } from '@/types/category';
import { toast } from 'sonner';

// Mock the server action
jest.mock('../../actions', () => ({
  updateCategoryAction: jest.fn(),
}));

// Mock toast
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

  it('should not call updateCategoryAction if no fields are changed', async () => {
    render(
      <EditCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={mockCategory}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    expect(updateCategoryAction).not.toHaveBeenCalled();
  });

  it('should show validation errors for invalid inputs', async () => {
    render(
      <EditCategoryModal
        open={true}
        onOpenChange={mockOnOpenChange}
        category={mockCategory}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'ab' } }); // too short

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    expect(await screen.findByText(/name too short/i)).toBeInTheDocument();
    expect(updateCategoryAction).not.toHaveBeenCalled();
  });

  it('should show error toast if update fails', async () => {
    (updateCategoryAction as jest.Mock).mockRejectedValue(new Error('Async error'));

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

  it('should disable buttons and show loading state while updating', async () => {
    // Create a promise that we can control
    let resolveUpdate: (value: any) => void;
    const updatePromise = new Promise((resolve) => {
      resolveUpdate = resolve;
    });
    (updateCategoryAction as jest.Mock).mockReturnValue(updatePromise);

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

    // Check loading state
    expect(saveButton).toBeDisabled();
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    expect(saveButton).toHaveTextContent(/save changes/i);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();

    // Resolve the promise
    resolveUpdate!({ ...mockCategory, name: 'Updated Electronics' });

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

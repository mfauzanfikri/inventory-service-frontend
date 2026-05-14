import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditCategoryModal } from '../edit-category-modal';
import { updateCategoryAction } from '../actions';
import { Category } from '@/types/category';

// Mock the server action
jest.mock('../actions', () => ({
  updateCategoryAction: jest.fn(),
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
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
});

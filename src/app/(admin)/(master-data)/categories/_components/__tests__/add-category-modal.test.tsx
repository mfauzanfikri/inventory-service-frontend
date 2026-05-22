import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddCategoryModal } from '../add-category-modal';
import { createCategoryAction } from '../../actions';
import { toast } from 'sonner';

jest.mock('../../actions', () => ({
  createCategoryAction: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AddCategoryModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the trigger button', () => {
    render(<AddCategoryModal />);
    expect(screen.getByRole('button', { name: /add category/i })).toBeInTheDocument();
  });

  it('should open the modal when clicked', async () => {
    render(<AddCategoryModal />);
    const trigger = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(trigger);

    expect(await screen.findByText(/create a new category for grouping inventory items/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(<AddCategoryModal />);
    fireEvent.click(screen.getByRole('button', { name: /add category/i }));

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(await screen.findByText(/name too short/i)).toBeInTheDocument();
    expect(await screen.findByText(/description is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/please select a valid status/i)).toBeInTheDocument();
  });

  it('should call createCategoryAction with correct data upon valid submission', async () => {
    const mockCategory = { id: 'test-1', name: 'Electronics', description: 'Tech things', status: 'active' };
    (createCategoryAction as jest.Mock).mockResolvedValue({ ok: true, data: mockCategory });

    render(<AddCategoryModal />);
    fireEvent.click(screen.getByRole('button', { name: /add category/i }));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Electronics' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Tech things' } });

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    fireEvent.click(screen.getByRole('option', { name: /^active$/i }));

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(createCategoryAction).toHaveBeenCalledWith({
        name: 'Electronics',
        description: 'Tech things',
        status: 'active',
      });
    });

    expect(screen.queryByText(/create a new category/i)).not.toBeInTheDocument();
  });

  it('should show error toast if submission fails', async () => {
    (createCategoryAction as jest.Mock).mockResolvedValue({
      ok: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to create category. Please try again.',
        category: 'unknown',
      },
    });

    render(<AddCategoryModal />);
    fireEvent.click(screen.getByRole('button', { name: /add category/i }));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Electronics' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Tech things' } });

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    fireEvent.click(screen.getByRole('option', { name: /^active$/i }));

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create category'),
        expect.any(Object)
      );
    });
  });
});

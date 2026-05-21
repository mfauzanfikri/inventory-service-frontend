import {
  CategoryConflictError,
  CategoryInfrastructureError,
  CategoryNotFoundError,
  createCategoryService,
} from '../category.service';
import { CategoryCreateInput, CategoryUpdateInput } from '@/types/category';

describe('CategoryService', () => {
  // Define our mock repository
  const mockRepository = {
    findAll: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // Create an isolated service instance injecting the mock repository
  const service = createCategoryService(mockRepository);

  beforeEach(() => {
    // Clear mock call history before each test to ensure complete isolation
    jest.clearAllMocks();
  });

  it('should get all categories by calling repository.findAll', async () => {
    const mockData = [{ id: '1', name: 'Mock Cat', description: 'Desc', status: 'active' as const }];
    mockRepository.findAll.mockResolvedValue(mockData);

    const categories = await service.getAll();
    
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(categories).toEqual(mockData);
  });

  it('should create a new category by calling repository.create', async () => {
    const input: CategoryCreateInput = {
      name: 'New Test Category',
      description: 'Test description',
      status: 'active',
    };
    const expectedOutput = { id: 'generated-id', ...input };
    mockRepository.create.mockResolvedValue(expectedOutput);

    const newCategory = await service.create(input);
    
    expect(mockRepository.create).toHaveBeenCalledWith(input);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(newCategory).toEqual(expectedOutput);
  });

  it('should return a category by name when repository finds one', async () => {
    const mockCategory = {
      id: '1',
      name: 'Electronics',
      description: 'Devices',
      status: 'active' as const,
    };
    mockRepository.findByName.mockResolvedValue(mockCategory);

    const category = await service.getByName('Electronics');

    expect(mockRepository.findByName).toHaveBeenCalledWith('Electronics');
    expect(category).toEqual(mockCategory);
  });

  it('should throw CategoryNotFoundError when repository returns null for getByName', async () => {
    mockRepository.findByName.mockResolvedValue(null);

    await expect(service.getByName('Missing')).rejects.toThrow(CategoryNotFoundError);
    await expect(service.getByName('Missing')).rejects.toThrow('Category with name Missing not found');
  });

  it('should map unexpected repository errors in getByName to infrastructure error', async () => {
    mockRepository.findByName.mockRejectedValue(new Error('repository failure'));

    await expect(service.getByName('Any')).rejects.toThrow(CategoryInfrastructureError);
  });

  it('should map conflict error in create to CategoryConflictError', async () => {
    const conflict = new Error('duplicate');
    (conflict as Error & { status?: number }).status = 409;
    mockRepository.create.mockRejectedValue(conflict);

    await expect(service.create({
      name: 'Electronics',
      description: 'Duplicate',
      status: 'active',
    })).rejects.toThrow(CategoryConflictError);
  });

  it('should update an existing category by calling repository.update', async () => {
    const id = 'target-id';
    const updateInput: CategoryUpdateInput = {
      name: 'Updated Name',
    };
    const expectedOutput = { id, name: 'Updated Name', description: 'Old desc', status: 'active' as const };
    mockRepository.update.mockResolvedValue(expectedOutput);

    const updated = await service.update(id, updateInput);
    
    expect(mockRepository.update).toHaveBeenCalledWith(id, updateInput);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(updated).toEqual(expectedOutput);
  });

  it('should throw CategoryNotFoundError when repository returns null for update', async () => {
    mockRepository.update.mockResolvedValue(null);

    await expect(service.update('missing-id', { name: 'Updated Name' })).rejects.toThrow(CategoryNotFoundError);
  });

  it('should map conflict error in update to CategoryConflictError', async () => {
    const conflict = new Error('duplicate');
    (conflict as Error & { status?: number }).status = 409;
    mockRepository.update.mockRejectedValue(conflict);

    await expect(service.update('target-id', { name: 'Electronics' })).rejects.toThrow(CategoryConflictError);
  });

  it('should delete a category by calling repository.delete', async () => {
    const id = 'target-id';
    mockRepository.delete.mockResolvedValue({
      id,
      name: 'Deleted',
      description: 'Deleted',
      status: 'active',
    });

    await service.delete(id);
    
    expect(mockRepository.delete).toHaveBeenCalledWith(id);
    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw CategoryNotFoundError when repository returns null for delete', async () => {
    mockRepository.delete.mockResolvedValue(null);

    await expect(service.delete('missing-id')).rejects.toThrow(CategoryNotFoundError);
  });
});

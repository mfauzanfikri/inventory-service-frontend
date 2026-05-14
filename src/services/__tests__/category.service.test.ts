import { createCategoryService } from '../category.service';
import { CreateCategoryInput, UpdateCategoryInput } from '@/types/category';

describe('CategoryService', () => {
  // Define our mock repository
  const mockRepository = {
    getAll: jest.fn(),
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

  it('should get all categories by calling repository.getAll', async () => {
    const mockData = [{ id: '1', name: 'Mock Cat', description: 'Desc', status: 'active' as const }];
    mockRepository.getAll.mockResolvedValue(mockData);

    const categories = await service.getAll();
    
    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(categories).toEqual(mockData);
  });

  it('should create a new category by calling repository.create', async () => {
    const input: CreateCategoryInput = {
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

  it('should update an existing category by calling repository.update', async () => {
    const id = 'target-id';
    const updateInput: UpdateCategoryInput = {
      name: 'Updated Name',
    };
    const expectedOutput = { id, name: 'Updated Name', description: 'Old desc', status: 'active' as const };
    mockRepository.update.mockResolvedValue(expectedOutput);

    const updated = await service.update(id, updateInput);
    
    expect(mockRepository.update).toHaveBeenCalledWith(id, updateInput);
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(updated).toEqual(expectedOutput);
  });

  it('should delete a category by calling repository.delete', async () => {
    const id = 'target-id';
    mockRepository.delete.mockResolvedValue(undefined);

    await service.delete(id);
    
    expect(mockRepository.delete).toHaveBeenCalledWith(id);
    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
  });
});

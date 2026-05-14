import { categoryService } from '../category.service';
import { CreateCategoryInput, UpdateCategoryInput } from '@/types/category';

describe('CategoryService', () => {
  it('should get all categories', async () => {
    const categories = await categoryService.getAll();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it('should create a new category', async () => {
    const input: CreateCategoryInput = {
      name: 'New Test Category',
      description: 'Test description',
      status: 'active',
    };
    const newCategory = await categoryService.create(input);
    expect(newCategory).toMatchObject(input);
    expect(newCategory.id).toBeDefined();

    const categories = await categoryService.getAll();
    expect(categories[0]).toEqual(newCategory); // Should be newest first
  });

  it('should update an existing category', async () => {
    const categories = await categoryService.getAll();
    const target = categories[0];
    const updateInput: UpdateCategoryInput = {
      name: 'Updated Name',
    };

    const updated = await categoryService.update(target.id, updateInput);
    expect(updated.name).toBe('Updated Name');
    expect(updated.id).toBe(target.id);
    expect(updated.description).toBe(target.description);
  });

  it('should delete a category', async () => {
    const categoriesBefore = await categoryService.getAll();
    const targetId = categoriesBefore[0].id;

    await categoryService.delete(targetId);

    const categoriesAfter = await categoryService.getAll();
    expect(categoriesAfter.length).toBe(categoriesBefore.length - 1);
    expect(categoriesAfter.find((c) => c.id === targetId)).toBeUndefined();
  });
});

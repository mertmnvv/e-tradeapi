using ECommerceApi.Data;
using ECommerceApi.DTOs.Category;
using ECommerceApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApi.Services;

public class CategoryService
{
    private readonly ECommerceContext _context;

    public CategoryService(ECommerceContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<CategoryDto> Categories, int TotalCount)> GetCategoriesAsync(
        int pageNumber = 1,
        int pageSize = 10,
        string? searchTerm = null)
    {
        var query = _context.Categories
            .Include(c => c.Products)
            .AsQueryable();

        // Filtreleme
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(c => 
                c.Name.Contains(searchTerm) || 
                (c.Description != null && c.Description.Contains(searchTerm)));
        }

        // Toplam sayı
        var totalCount = await query.CountAsync();

        // Sayfalama
        var categories = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                ProductCount = c.Products.Count
            })
            .ToListAsync();

        return (categories, totalCount);
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ImageUrl = category.ImageUrl,
            ProductCount = category.Products.Count
        };
    }

    public async Task<CategoryDto?> CreateCategoryAsync(CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            Description = request.Description,
            ImageUrl = request.ImageUrl
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return await GetCategoryByIdAsync(category.Id);
    }

    public async Task<CategoryDto?> UpdateCategoryAsync(int id, UpdateCategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return null;

        if (request.Name != null)
            category.Name = request.Name;
        
        if (request.Description != null)
            category.Description = request.Description;
        
        if (request.ImageUrl != null)
            category.ImageUrl = request.ImageUrl;

        await _context.SaveChangesAsync();

        return await GetCategoryByIdAsync(id);
    }

    public async Task<bool> DeleteCategoryAsync(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return false;

        // Kategoriye ait ürün varsa silmeyi engelle
        if (category.Products.Any())
            return false;

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return true;
    }
} 
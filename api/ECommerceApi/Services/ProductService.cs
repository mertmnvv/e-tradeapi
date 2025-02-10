using ECommerceApi.Data;
using ECommerceApi.DTOs.Product;
using ECommerceApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApi.Services;

public class ProductService
{
    private readonly ECommerceContext _context;

    public ProductService(ECommerceContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<ProductDto> Products, int TotalCount)> GetProductsAsync(
        int pageNumber = 1,
        int pageSize = 10,
        string? searchTerm = null,
        int? categoryId = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        bool includeOutOfStock = true)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Discount)
            .AsQueryable();

        // Filtreleme
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(p => 
                p.Name.Contains(searchTerm) || 
                p.Description.Contains(searchTerm));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(p => p.Price >= minPrice);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= maxPrice);
        }

        if (!includeOutOfStock)
        {
            query = query.Where(p => p.Stock > 0);
        }

        // Toplam sayı
        var totalCount = await query.CountAsync();

        // Sayfalama
        var products = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                DiscountId = p.DiscountId,
                DiscountedPrice = p.Discount != null 
                    ? p.Price * (1 - p.Discount.DiscountPercent / 100)
                    : null
            })
            .ToListAsync();

        return (products, totalCount);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Discount)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return null;

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            ImageUrl = product.ImageUrl,
            CategoryId = product.CategoryId,
            CategoryName = product.Category.Name,
            DiscountId = product.DiscountId,
            DiscountedPrice = product.Discount != null 
                ? product.Price * (1 - product.Discount.DiscountPercent / 100)
                : null
        };
    }

    public async Task<ProductDto?> CreateProductAsync(CreateProductRequest request)
    {
        var category = await _context.Categories.FindAsync(request.CategoryId);
        if (category == null)
            return null;

        if (request.DiscountId.HasValue)
        {
            var discount = await _context.Discounts.FindAsync(request.DiscountId);
            if (discount == null)
                return null;
        }

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            ImageUrl = request.ImageUrl,
            CategoryId = request.CategoryId,
            DiscountId = request.DiscountId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return await GetProductByIdAsync(product.Id);
    }

    public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductRequest request)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return null;

        if (request.CategoryId.HasValue)
        {
            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null)
                return null;
        }

        if (request.DiscountId.HasValue)
        {
            var discount = await _context.Discounts.FindAsync(request.DiscountId);
            if (discount == null)
                return null;
        }

        if (request.Name != null)
            product.Name = request.Name;
        
        if (request.Description != null)
            product.Description = request.Description;
        
        if (request.Price.HasValue)
            product.Price = request.Price.Value;
        
        if (request.Stock.HasValue)
            product.Stock = request.Stock.Value;
        
        if (request.ImageUrl != null)
            product.ImageUrl = request.ImageUrl;
        
        if (request.CategoryId.HasValue)
            product.CategoryId = request.CategoryId.Value;
        
        if (request.DiscountId.HasValue)
            product.DiscountId = request.DiscountId;

        await _context.SaveChangesAsync();

        return await GetProductByIdAsync(id);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateStockAsync(int id, int quantity)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null || product.Stock < quantity)
            return false;

        product.Stock -= quantity;
        await _context.SaveChangesAsync();

        return true;
    }
} 
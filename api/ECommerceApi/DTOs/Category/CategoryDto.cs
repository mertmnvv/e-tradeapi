using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.DTOs.Category;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int ProductCount { get; set; }
}

public class CreateCategoryRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    [Url]
    public string? ImageUrl { get; set; }
}

public class UpdateCategoryRequest
{
    [StringLength(100)]
    public string? Name { get; set; }
    public string? Description { get; set; }

    [Url]
    public string? ImageUrl { get; set; }
}

public class CategoryResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public CategoryDto? Data { get; set; }
}

public class CategoryListResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public IEnumerable<CategoryDto> Data { get; set; } = new List<CategoryDto>();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
} 
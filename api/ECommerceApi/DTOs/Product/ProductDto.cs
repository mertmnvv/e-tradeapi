using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.DTOs.Product;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string ImageUrl { get; set; } = null!;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public int? DiscountId { get; set; }
    public decimal? DiscountedPrice { get; set; }
}

public class CreateProductRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Required]
    public string Description { get; set; } = null!;

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    [Required]
    [Url]
    public string ImageUrl { get; set; } = null!;

    [Required]
    public int CategoryId { get; set; }

    public int? DiscountId { get; set; }
}

public class UpdateProductRequest
{
    [StringLength(100)]
    public string? Name { get; set; }
    public string? Description { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal? Price { get; set; }

    [Range(0, int.MaxValue)]
    public int? Stock { get; set; }

    [Url]
    public string? ImageUrl { get; set; }
    public int? CategoryId { get; set; }
    public int? DiscountId { get; set; }
}

public class ProductResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public ProductDto? Data { get; set; }
}

public class ProductListResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public IEnumerable<ProductDto> Data { get; set; } = new List<ProductDto>();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
} 
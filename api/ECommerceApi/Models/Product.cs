using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.Models;

public class Product
{
    public int Id { get; set; }
    
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
    public Category Category { get; set; } = null!;
    
    public int? DiscountId { get; set; }
    public Discount? Discount { get; set; }
} 
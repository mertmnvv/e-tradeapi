using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.Models;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;
    
    public string? Description { get; set; }
    
    [Url]
    public string? ImageUrl { get; set; }
    
    public ICollection<Product> Products { get; set; } = new List<Product>();
} 
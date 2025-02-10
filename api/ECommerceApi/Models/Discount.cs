using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.Models;

public class Discount
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;
    
    public string? Description { get; set; }
    
    [Required]
    [Range(0, 100)]
    public decimal DiscountPercent { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    public DateTime? EndDate { get; set; }
    
    public bool IsActive { get; set; }
    
    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Campaign> Campaigns { get; set; } = new List<Campaign>();
} 
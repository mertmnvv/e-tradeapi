using System;
using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.Models;

public class Campaign
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;
    
    public int DiscountId { get; set; }
    public Discount Discount { get; set; } = null!;
    
    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }
} 
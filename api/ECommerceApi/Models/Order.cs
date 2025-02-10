using System;
using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.Models;

public class Order
{
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = null!;
    
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
    
    [Required]
    public DateTime OrderDate { get; set; }
    
    [Required]
    public string ShippingAddress { get; set; } = null!;
    
    public Shipping? Shipping { get; set; }
} 
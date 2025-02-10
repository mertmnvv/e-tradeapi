using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.Models;

public class Shipping
{
    public int Id { get; set; }
    
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    
    [Required]
    public string ShippingStatus { get; set; } = null!;
    
    public string? TrackingNumber { get; set; }
} 
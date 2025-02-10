using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.DTOs.Auth;

public class RegisterRequest
{
    [Required]
    [StringLength(50)]
    public string Username { get; set; } = null!;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
    
    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = null!;
} 
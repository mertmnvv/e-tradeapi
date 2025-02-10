using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.DTOs.Auth;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
    
    [Required]
    public string Password { get; set; } = null!;
} 
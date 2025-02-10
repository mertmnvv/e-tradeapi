using System.ComponentModel.DataAnnotations;

namespace ECommerceApi.DTOs.Auth;

public class RefreshTokenRequest
{
    [Required]
    public string AccessToken { get; set; } = null!;
    
    [Required]
    public string RefreshToken { get; set; } = null!;
}

public class RevokeTokenRequest
{
    [Required]
    public string RefreshToken { get; set; } = null!;
}

public class TokenResponse
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}

public class AuthResponse
{
    public UserDto User { get; set; } = null!;
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
} 
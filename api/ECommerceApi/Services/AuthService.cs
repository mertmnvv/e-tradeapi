using ECommerceApi.Data;
using ECommerceApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerceApi.Services;

public class AuthService
{
    private readonly ECommerceContext _context;
    private readonly JwtService _jwtService;

    public AuthService(ECommerceContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<(User? User, string? AccessToken, string? RefreshToken)> AuthenticateAsync(string email, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            return (null, null, null);
        }

        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
        await _context.SaveChangesAsync();

        return (user, accessToken, refreshToken);
    }

    public async Task<(string? AccessToken, string? RefreshToken)> RefreshTokenAsync(string accessToken, string refreshToken)
    {
        var principal = _jwtService.GetPrincipalFromExpiredToken(accessToken);
        if (principal == null)
        {
            return (null, null);
        }

        var userId = int.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var user = await _context.Users.FindAsync(userId);

        if (user == null || 
            user.RefreshToken != refreshToken || 
            user.RefreshTokenExpiryTime <= DateTime.Now)
        {
            return (null, null);
        }

        var newAccessToken = _jwtService.GenerateAccessToken(user);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
        await _context.SaveChangesAsync();

        return (newAccessToken, newRefreshToken);
    }

    public async Task<bool> RevokeTokenAsync(string refreshToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        if (user == null)
        {
            return false;
        }

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<User?> RegisterAsync(string username, string email, string password, string role = "User")
    {
        if (await _context.Users.AnyAsync(u => u.Email == email))
        {
            return null;
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User
        {
            Username = username,
            Email = email,
            PasswordHash = passwordHash,
            Role = role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }
} 
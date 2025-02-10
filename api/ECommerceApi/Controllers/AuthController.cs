using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerceApi.Models;
using ECommerceApi.Services;
using ECommerceApi.DTOs;
using ECommerceApi.DTOs.Auth;
using ECommerceApi.DTOs.Common;

namespace ECommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Registers a new user
    /// </summary>
    /// <param name="request">User registration details</param>
    /// <returns>The newly created user</returns>
    /// <response code="200">Returns the newly created user</response>
    /// <response code="400">If the email already exists</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> Register([FromBody] RegisterRequest request)
    {
        var user = await _authService.RegisterAsync(request.Username, request.Email, request.Password);
        if (user == null)
        {
            return BadRequest(new ErrorResponse { Message = "Email already exists" });
        }

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role
        });
    }

    /// <summary>
    /// Authenticates a user and returns access and refresh tokens
    /// </summary>
    /// <param name="request">User login credentials</param>
    /// <returns>User details and tokens</returns>
    /// <response code="200">Returns the user details and tokens</response>
    /// <response code="400">If the credentials are invalid</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var (user, accessToken, refreshToken) = await _authService.AuthenticateAsync(request.Email, request.Password);
        if (user == null)
        {
            return BadRequest(new ErrorResponse { Message = "Invalid email or password" });
        }

        return Ok(new AuthResponse
        {
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            },
            AccessToken = accessToken!,
            RefreshToken = refreshToken!
        });
    }

    /// <summary>
    /// Refreshes an expired access token using a refresh token
    /// </summary>
    /// <param name="request">Current access and refresh tokens</param>
    /// <returns>New access and refresh tokens</returns>
    /// <response code="200">Returns new tokens</response>
    /// <response code="400">If the tokens are invalid</response>
    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(TokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TokenResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var (accessToken, refreshToken) = await _authService.RefreshTokenAsync(request.AccessToken, request.RefreshToken);
        if (accessToken == null)
        {
            return BadRequest(new ErrorResponse { Message = "Invalid token" });
        }

        return Ok(new TokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken!
        });
    }

    /// <summary>
    /// Revokes a refresh token
    /// </summary>
    /// <param name="request">Refresh token to revoke</param>
    /// <returns>No content</returns>
    /// <response code="200">If the token was successfully revoked</response>
    /// <response code="400">If the token is invalid</response>
    [HttpPost("revoke-token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequest request)
    {
        var result = await _authService.RevokeTokenAsync(request.RefreshToken);
        if (!result)
        {
            return BadRequest(new ErrorResponse { Message = "Invalid token" });
        }

        return Ok();
    }
}

public class RegisterRequest
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class LoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class RefreshTokenRequest
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}

public class RevokeTokenRequest
{
    public string RefreshToken { get; set; } = null!;
}

public class AuthResponse
{
    public UserDto User { get; set; } = null!;
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}

public class TokenResponse
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
} 
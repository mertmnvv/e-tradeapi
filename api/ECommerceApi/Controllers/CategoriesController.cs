using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerceApi.DTOs.Category;
using ECommerceApi.DTOs.Common;
using ECommerceApi.Services;

namespace ECommerceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    /// <summary>
    /// Kategorileri listeler
    /// </summary>
    /// <param name="pageNumber">Sayfa numarası</param>
    /// <param name="pageSize">Sayfa başına kategori sayısı</param>
    /// <param name="searchTerm">Arama terimi</param>
    [HttpGet]
    [ProducesResponseType(typeof(CategoryListResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<CategoryListResponse>> GetCategories(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null)
    {
        var (categories, totalCount) = await _categoryService.GetCategoriesAsync(
            pageNumber, pageSize, searchTerm);

        return Ok(new CategoryListResponse
        {
            Success = true,
            Data = categories,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// ID'ye göre kategori getirir
    /// </summary>
    /// <param name="id">Kategori ID</param>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CategoryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoryResponse>> GetCategory(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        if (category == null)
        {
            return NotFound(new ErrorResponse { Message = "Kategori bulunamadı" });
        }

        return Ok(new CategoryResponse
        {
            Success = true,
            Data = category
        });
    }

    /// <summary>
    /// Yeni kategori oluşturur
    /// </summary>
    /// <param name="request">Kategori bilgileri</param>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(CategoryResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CategoryResponse>> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var category = await _categoryService.CreateCategoryAsync(request);

        return CreatedAtAction(nameof(GetCategory), new { id = category!.Id }, new CategoryResponse
        {
            Success = true,
            Data = category
        });
    }

    /// <summary>
    /// Kategori bilgilerini günceller
    /// </summary>
    /// <param name="id">Kategori ID</param>
    /// <param name="request">Güncellenecek bilgiler</param>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(CategoryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoryResponse>> UpdateCategory(int id, [FromBody] UpdateCategoryRequest request)
    {
        var category = await _categoryService.UpdateCategoryAsync(id, request);
        if (category == null)
        {
            return NotFound(new ErrorResponse { Message = "Kategori bulunamadı" });
        }

        return Ok(new CategoryResponse
        {
            Success = true,
            Data = category
        });
    }

    /// <summary>
    /// Kategoriyi siler
    /// </summary>
    /// <param name="id">Kategori ID</param>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var result = await _categoryService.DeleteCategoryAsync(id);
        if (!result)
        {
            // Kategori bulunamadı veya kategoriye ait ürünler var
            return BadRequest(new ErrorResponse { Message = "Kategori silinemedi. Kategoriye ait ürünler olabilir." });
        }

        return NoContent();
    }
} 
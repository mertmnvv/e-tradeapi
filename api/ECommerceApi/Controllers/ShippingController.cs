using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerceApi.Data;
using ECommerceApi.Models;

namespace ECommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShippingController : ControllerBase
    {
        private readonly ECommerceContext _context;

        public ShippingController(ECommerceContext context)
        {
            _context = context;
        }

        // GET: api/Shipping
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shipping>>> GetShippings()
        {
            return await _context.Shippings
                .Include(s => s.Order)
                .ToListAsync();
        }

        // GET: api/Shipping/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Shipping>> GetShipping(int id)
        {
            var shipping = await _context.Shippings
                .Include(s => s.Order)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (shipping == null)
            {
                return NotFound();
            }

            return shipping;
        }

        // GET: api/Shipping/Tracking/{trackingNumber}
        [HttpGet("Tracking/{trackingNumber}")]
        public async Task<ActionResult<Shipping>> GetShippingByTrackingNumber(string trackingNumber)
        {
            var shipping = await _context.Shippings
                .Include(s => s.Order)
                .FirstOrDefaultAsync(s => s.TrackingNumber == trackingNumber);

            if (shipping == null)
            {
                return NotFound();
            }

            return shipping;
        }

        // PUT: api/Shipping/5/Status
        [HttpPut("{id}/Status")]
        public async Task<IActionResult> UpdateShippingStatus(int id, [FromBody] string status)
        {
            var shipping = await _context.Shippings.FindAsync(id);
            if (shipping == null)
            {
                return NotFound();
            }

            shipping.ShippingStatus = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Shipping/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShipping(int id, Shipping shipping)
        {
            if (id != shipping.Id)
            {
                return BadRequest();
            }

            _context.Entry(shipping).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShippingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool ShippingExists(int id)
        {
            return _context.Shippings.Any(e => e.Id == id);
        }
    }
} 
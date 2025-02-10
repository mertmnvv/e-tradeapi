using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ECommerceApi.Data;

public class ECommerceContextFactory : IDesignTimeDbContextFactory<ECommerceContext>
{
    public ECommerceContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ECommerceContext>();
        optionsBuilder.UseSqlServer("Server=tcp:mert123.database.windows.net,1433;Initial Catalog=e_ticaret;Persist Security Info=False;User ID=mert;Password=22932293Me;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

        return new ECommerceContext(optionsBuilder.Options);
    }
} 
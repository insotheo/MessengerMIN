using Microsoft.EntityFrameworkCore;

namespace MINServer.Data
{
    public class MessengerDbContext : DbContext
    {
        public MessengerDbContext(DbContextOptions<MessengerDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

    }
}

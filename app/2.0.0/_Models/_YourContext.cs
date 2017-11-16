using Microsoft.EntityFrameworkCore;

namespace <%= namespace %>.Models
{
    public class <%= projname %>Context : DbContext
    {
        // base() calls the parent class' constructor passing the "options" parameter along
        public <%= projname %>Context(DbContextOptions<<%= projname %>Context> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<<%= first_app %>> <%= first_app_upper_plural %> { get; set; }
    }
}

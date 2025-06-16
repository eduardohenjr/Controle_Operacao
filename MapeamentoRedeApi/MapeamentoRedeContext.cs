using Microsoft.EntityFrameworkCore;
using MapeamentoRedeApi.Models;

namespace MapeamentoRedeApi
{
    public class MapeamentoRedeContext : DbContext
    {
        public MapeamentoRedeContext(DbContextOptions<MapeamentoRedeContext> options) : base(options) { }

        public DbSet<Caixa> Caixas { get; set; }
        public DbSet<Cabo> Cabos { get; set; }
        public DbSet<Fita> Fitas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Relacionamento Cabo -> Fitas
            modelBuilder.Entity<Fita>()
                .HasOne(f => f.Cabo)
                .WithMany()
                .HasForeignKey(f => f.CaboId);
        }
    }
}

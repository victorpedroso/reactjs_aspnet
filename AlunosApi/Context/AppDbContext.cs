using AlunosApi.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AlunosApi.Context;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Aluno> Alunos { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Aluno>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Nome)
                .IsRequired()
                .HasMaxLength(80);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100)
                .HasAnnotation("EmailAddress", "");

            entity.Property(e => e.Idade)
                .IsRequired();

            entity.Property(e => e.DataCadastro)
                .IsRequired(false);
            entity.HasData(
                new Aluno
                {
                    Id = 1,
                    Nome = "Aluno 1",
                    Email = "aluno1@localhost.com",
                    Idade = 19,
                    DataCadastro = DateTime.Now
                },
                new Aluno
                {
                    Id = 2,
                    Nome = "Aluno 2",
                    Email = "aluno2@localhost.com",
                    Idade = 23,
                    DataCadastro = DateTime.Now
                });
        });

        modelBuilder.Entity<RefreshToken>().HasOne(rt => rt.User).WithMany().HasForeignKey(rt => rt.UserId);
    }
}

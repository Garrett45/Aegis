using System;
using System.Collections.Generic;
using Api.Shared.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Shared.EntityFrameworkCore;

public partial class AegisContext : DbContext
{
    public AegisContext(DbContextOptions<AegisContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<FlywaySchemaHistory> FlywaySchemaHistories { get; set; }

    public virtual DbSet<InitiativeItem> InitiativeItems { get; set; }

    public virtual DbSet<InitiativeList> InitiativeLists { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("account_pk");

            entity.ToTable("account");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.FirstName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("first_name");
            entity.Property(e => e.IdentityProviderId)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("identity_provider_id");
            entity.Property(e => e.LastName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("last_name");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<FlywaySchemaHistory>(entity =>
        {
            entity.HasKey(e => e.InstalledRank).HasName("flyway_schema_history_pk");

            entity.ToTable("flyway_schema_history");

            entity.HasIndex(e => e.Success, "flyway_schema_history_s_idx");

            entity.Property(e => e.InstalledRank)
                .ValueGeneratedNever()
                .HasColumnName("installed_rank");
            entity.Property(e => e.Checksum).HasColumnName("checksum");
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .HasColumnName("description");
            entity.Property(e => e.ExecutionTime).HasColumnName("execution_time");
            entity.Property(e => e.InstalledBy)
                .HasMaxLength(100)
                .HasColumnName("installed_by");
            entity.Property(e => e.InstalledOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("installed_on");
            entity.Property(e => e.Script)
                .HasMaxLength(1000)
                .HasColumnName("script");
            entity.Property(e => e.Success).HasColumnName("success");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .HasColumnName("type");
            entity.Property(e => e.Version)
                .HasMaxLength(50)
                .HasColumnName("version");
        });

        modelBuilder.Entity<InitiativeItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("initiative_item_pk");

            entity.ToTable("initiative_item");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Ac).HasColumnName("ac");
            entity.Property(e => e.Hp).HasColumnName("hp");
            entity.Property(e => e.Initiative).HasColumnName("initiative");
            entity.Property(e => e.InitiativeBonus).HasColumnName("initiative_bonus");
            entity.Property(e => e.InitiativeListId).HasColumnName("initiative_list_id");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.SortOrder).HasColumnName("sort_order");

            entity.HasOne(d => d.InitiativeList).WithMany(p => p.InitiativeItems)
                .HasForeignKey(d => d.InitiativeListId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("initiative_item_initiative_list_id_fk");
        });

        modelBuilder.Entity<InitiativeList>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("initiative_list_pk");

            entity.ToTable("initiative_list");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountId).HasColumnName("account_id");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Round).HasColumnName("round");

            entity.HasOne(d => d.Account).WithMany(p => p.InitiativeLists)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("initiative_list_account_id_fk");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

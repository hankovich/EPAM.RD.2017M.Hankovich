namespace EPAM.RD._2017M.Hankovich.ORM
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class GalleryModel : DbContext
    {
        public GalleryModel()
            : base("name=GalleryModel")
        {
        }

        public virtual DbSet<Album> Albums { get; set; }
        public virtual DbSet<Photo> Photos { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Album>()
                .Property(e => e.AlbumName)
                .IsUnicode(false);

            modelBuilder.Entity<Album>()
                .HasMany(e => e.Photos)
                .WithRequired(e => e.Album)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Photo>()
                .Property(e => e.Title)
                .IsUnicode(false);

            modelBuilder.Entity<Photo>()
                .Property(e => e.Description)
                .IsUnicode(false);

            modelBuilder.Entity<Photo>()
                .Property(e => e.Path)
                .IsUnicode(false);

            modelBuilder.Entity<Role>()
                .Property(e => e.Name)
                .IsUnicode(false);

            modelBuilder.Entity<Role>()
                .HasMany(e => e.Users)
                .WithRequired(e => e.Role)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<User>()
                .Property(e => e.Login)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.Password)
                .IsUnicode(false);
        }
    }
}

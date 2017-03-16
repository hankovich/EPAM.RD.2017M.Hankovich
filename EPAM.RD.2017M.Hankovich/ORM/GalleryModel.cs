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
        }
    }
}

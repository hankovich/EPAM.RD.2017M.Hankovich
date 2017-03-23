namespace EPAM.RD._2017M.Hankovich.ORM
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Photo")]
    public partial class Photo
    {
        public int Id { get; set; }

        public int AlbumId { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        public DateTime CreationDate { get; set; }

        public int TotalRate { get; set; }

        public int RateCount { get; set; }

        [Required]
        [StringLength(255)]
        public string Path { get; set; }

        public virtual Album Album { get; set; }
    }
}

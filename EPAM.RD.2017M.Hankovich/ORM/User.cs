namespace EPAM.RD._2017M.Hankovich.ORM
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("User")]
    public partial class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Login { get; set; }

        [Required]
        [StringLength(255)]
        public string Password { get; set; }

        public int RoleId { get; set; }

        public virtual Role Role { get; set; }
    }
}

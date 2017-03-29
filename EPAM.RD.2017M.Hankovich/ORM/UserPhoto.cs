namespace EPAM.RD._2017M.Hankovich.ORM
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("UserPhoto")]
    public partial class UserPhoto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int PhotoId { get; set; }

        public virtual Photo Photo { get; set; }

        public virtual User User { get; set; }
    }
}

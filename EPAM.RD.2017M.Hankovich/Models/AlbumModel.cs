using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAM.RD._2017M.Hankovich.Models
{
    public class AlbumModel
    {
        public int Id { get; set; }
        public string albumName { get; set; }
        public IEnumerable<PhotoModel> photos;
    }
}
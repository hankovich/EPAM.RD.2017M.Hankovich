using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EPAM.RD._2017M.Hankovich.Models
{
    public class PhotoModel
    {
        public int Id { get; set; }
        public int AlbumId { get; set; }
        public string name { get; set; }
        public string descr { get; set; }
        public string CreationDate { get; set; }
        public int TotalRate { get; set; }
        public int RateCount { get; set; }
        public string src { get; set; }
    }
}
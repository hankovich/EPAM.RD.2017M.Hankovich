using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using EPAM.RD._2017M.Hankovich.Models;
using EPAM.RD._2017M.Hankovich.ORM;

namespace EPAM.RD._2017M.Hankovich.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetAlbums()
        {
            GalleryModel model = new GalleryModel();
            List<AlbumModel> models = new List<AlbumModel>();
            foreach (var album in model.Albums)
            {
                models.Add(new AlbumModel
                {
                    Id = album.Id,
                    albumName = album.AlbumName,
                    photos = model.Photos.Where(photo => photo.AlbumId == album.Id).Select(photo => new PhotoModel
                    {
                        Id = photo.Id,
                        AlbumId = photo.AlbumId,
                        CreationDate = photo.CreationDate,
                        descr = photo.Description,
                        name = photo.Title,
                        RateCount = photo.RateCount,
                        TotalRate = photo.TotalRate,
                        src = photo.Path
                    })
                });
            }
            var result = Json(models, JsonRequestBehavior.AllowGet);

            return result;
        }
    }
}
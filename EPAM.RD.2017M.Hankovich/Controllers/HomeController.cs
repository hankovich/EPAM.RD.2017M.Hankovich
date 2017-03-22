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

            List<AlbumModel> models = model.Albums.Select(album => new AlbumModel
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
            }).ToList();

            var result = Json(models, JsonRequestBehavior.AllowGet);

            return result;
        }

        public void RemoveImg(PhotoToDeleteModel model)
        {
            //some removing logic here
            var a = model.AlbumName;
            //return false;
        }
    }
}
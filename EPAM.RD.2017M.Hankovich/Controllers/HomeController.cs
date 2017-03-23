using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using EPAM.RD._2017M.Hankovich.Models;
using EPAM.RD._2017M.Hankovich.ORM;
using System.Drawing;
using System.Drawing.Imaging;

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
                    src = photo.Path.StartsWith("http") ? photo.Path : photo.Path.Remove(0, 90)
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

        [HttpPost]
        public void AddImg(string name, string src, string album, string file)
        {
            string path = GetPathToImg($"{RsHash(file)}.{file.Split('/', ';')[1]}");
            GalleryModel model = new GalleryModel();

            if (model.Photos.Where(x => x.Path == path).Count() == 0)
            {
                var bytes = Convert.FromBase64String(file.Split(',')[1]);

                using (var imageFile = new FileStream(path, FileMode.Create))
                {
                    imageFile.Write(bytes, 0, bytes.Length);
                    imageFile.Flush();
                }
            }

            model.Photos.Add(new Photo
            {
                Path = path,
                AlbumId = 2,
                Title = name,
                RateCount = 0,
                TotalRate = 0,
                Description = "qeqwe",
                CreationDate = DateTime.Now,
            });

            model.SaveChanges();
        }

        private string GetPathToImg(string filename)
        {
            string serverPath = Server.MapPath("~");
            return Path.Combine(serverPath, "Content", "img", filename);
        }

        private static int RsHash(string str)
        {
            const int b = 378551;
            int a = 63689;
            int hash = 0;

            foreach (char t in str)
            {
                hash = hash * a + t;
                a *= b;
            }
            return hash;
        }
    }
}
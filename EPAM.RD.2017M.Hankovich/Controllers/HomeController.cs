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
using System.Globalization;
using System.Net;

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
                    CreationDate = photo.CreationDate.ToString(),
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

        [HttpPost]
        public void AddImg(string name, string src, string albumName, string description)
        {
            string pseudopath;
            bool isUrl = false;

            if (src.StartsWith("http"))
            {
                isUrl = true;
                pseudopath = $"{RsHash(src)}.{src.Substring(src.LastIndexOf('.'))}";
            }
            else
            {
                pseudopath = $"{RsHash(src)}.{src.Split('/', ';')[1]}";
            }

            string path = GetFullPathToImg(pseudopath);
            GalleryModel model = new GalleryModel();

            AddAlbum(albumName);

            if (model.Photos.Count(x => x.Path == path) == 0)
            {
                if (isUrl)
                    SaveImageFromURL(src, path);
                else
                    SaveImageFronBase64(src, path);
            }

            model.Photos.Add(new Photo
            {
                Path = GetRelationalPathToImg(pseudopath),
                AlbumId = model.Albums.FirstOrDefault(album => album.AlbumName == albumName).Id,
                Title = name,
                RateCount = 0,
                TotalRate = 0,
                Description = description,
                CreationDate = DateTime.Now,
            });

            model.SaveChanges();
        }

        private string GetFullPathToImg(string filename)
        {
            string serverPath = Server.MapPath("~");
            return Path.Combine(serverPath, "Content", "img", filename);
        }

        private string GetRelationalPathToImg(string filename)
        {
            return Path.Combine("Content", "img", filename);
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

        private void SaveImageFromURL(string url, string path)
        {
            try
            {
                WebRequest req = WebRequest.Create(url);
                WebResponse response = req.GetResponse();
                Stream stream = response.GetResponseStream();

                byte[] buffer = new byte[1024];

                int dataLength = (int)response.ContentLength;

                MemoryStream memStream = new MemoryStream();
                
                while (true)
                {
                    int bytesRead = stream.Read(buffer, 0, buffer.Length);

                    if (bytesRead == 0)
                    {
                        break;
                    }
                    else
                    {
                        memStream.Write(buffer, 0, bytesRead);
                    }      
                }

                byte[] downloadedData = memStream.ToArray();


                using (var imageFile = new FileStream(path, FileMode.Create))
                {
                    imageFile.Write(downloadedData, 0, downloadedData.Length);
                    imageFile.Flush();
                }


                stream.Close();
                memStream.Close();
            }
            catch (Exception e)
            {
                var a = e.StackTrace;
            }
        }

        private void SaveImageFronBase64(string src, string path)
        {
            var bytes = Convert.FromBase64String(src.Split(',')[1]);

            using (var imageFile = new FileStream(path, FileMode.Create))
            {
                imageFile.Write(bytes, 0, bytes.Length);
                imageFile.Flush();
            }
        }

        public void AddAlbum(string albumName)
        {
            GalleryModel model = new GalleryModel();

            if (model.Albums.Count(album => album.AlbumName == albumName) == 0)
            {
                model.Albums.Add(new Album
                {
                    AlbumName = albumName
                });
            }
            model.SaveChanges();
        }
    }
}
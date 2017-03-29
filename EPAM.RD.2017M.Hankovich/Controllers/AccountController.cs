using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Core;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Security;
using EPAM.RD._2017M.Hankovich.Models;
using EPAM.RD._2017M.Hankovich.ORM;
using EPAM.RD._2017M.Hankovich.Providers;

namespace EPAM.RD._2017M.Hankovich.Controllers
{
    public class AccountController : Controller
    {
        [HttpPost]
        public ActionResult AddPhotoToCart(int photoId)
        {
            GalleryModel model = new GalleryModel();
            try
            {
                var userId = model.Users.FirstOrDefault(user => user.Login == User.Identity.Name).Id;
                var userPhoto = new UserPhoto
                {
                    UserId = userId,
                    PhotoId = photoId
                };
                
                //if(!model.UserPhotoes.Contains(userPhoto))
                    model.UserPhotoes.Add(userPhoto);
                model.SaveChanges();
                return Json(true);
            }
            catch (Exception)
            {
                return Json(false);
            }
        }

        public ActionResult DeletePhotoFromCart(int photoId)
        {
            GalleryModel model = new GalleryModel();
            try
            {
                var userId = model.Users.FirstOrDefault(user => user.Login == User.Identity.Name).Id;
                var userPhoto = new UserPhoto
                {
                    Id = model.UserPhotoes.FirstOrDefault(up => up.PhotoId == photoId && up.UserId == userId).Id,
                    UserId = userId,
                    PhotoId = photoId
                };


               /* bool oldValidateOnSaveEnabled = model.Configuration.ValidateOnSaveEnabled;

                try
                {
                    model.Configuration.ValidateOnSaveEnabled = false;

                    model.UserPhotoes.Attach(userPhoto);
                    model.Entry(userPhoto).State = EntityState.Deleted;
                    model.SaveChanges();
                }
                finally
                {
                    model.Configuration.ValidateOnSaveEnabled = oldValidateOnSaveEnabled;
                }*/


                //var entry = model.Entry(userPhoto);
                //entry.State = EntityState.Modified;

                //if (entry.State == EntityState.Detached)
                //    model.UserPhotoes.Attach(userPhoto);


                model.UserPhotoes.Remove(userPhoto);
                model.SaveChanges();

                return Json(true);
            }
            catch (Exception)
            {
                return Json(false);
            }
        }

        public ActionResult GetUserCart()
        {
            GalleryModel model = new GalleryModel();
            try
            {
                var userId = model.Users.FirstOrDefault(user => user.Login == User.Identity.Name).Id;

                var photos = model.UserPhotoes.Where(
                    user =>
                        user.UserId == userId)
                    .Select(userPhoto => new PhotoModel
                    {
                        Id = model.Photos.FirstOrDefault(photo => photo.Id == userPhoto.PhotoId).Id,
                        AlbumId = model.Photos.FirstOrDefault(photo => photo.Id == userPhoto.PhotoId).AlbumId,
                        CreationDate = model.Photos.FirstOrDefault(photo => photo.Id == userPhoto.PhotoId).CreationDate.ToString(),
                        descr = model.Photos.FirstOrDefault(photo => photo.Id == userPhoto.PhotoId).Description,
                        name = model.Photos.FirstOrDefault(photo => photo.Id == userPhoto.PhotoId).Title,
                        RateCount = 0,
                        TotalRate = 0,
                        src = model.Photos.FirstOrDefault(photo => photo.Id == userPhoto.PhotoId).Path
                    }).ToArray();
                return Json(photos, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            return Json(true);
        }

        public ActionResult IsAuthenticated()
        {
            return Json(User.Identity.IsAuthenticated);
        }

        public ActionResult UserName()
        {
            return Json(User.Identity.Name);
        }

        public ActionResult IsInRole(string role)
        {
            return Json(User.IsInRole(role));
        }

        public ActionResult Description()
        {
            var descr = System.Configuration.ConfigurationManager.AppSettings["description"];
            return Json(descr);
        }

        public ActionResult ChangeDescription(string newDescription)
        {

            Configuration config = WebConfigurationManager.OpenWebConfiguration("/");
            string oldValue = config.AppSettings.Settings["description"].Value;
            config.AppSettings.Settings["description"].Value = newDescription;
            config.Save(ConfigurationSaveMode.Modified);


            //System.Configuration.ConfigurationManager.AppSettings["description"] = newDescription;
            //System.Configuration.ConfigurationManager.AppSettings
            return Json(true);
        }

        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            return Json(true);
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Login(LoginModel viewModel, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                if (Membership.ValidateUser(viewModel.Login, viewModel.Password))
                {
                    FormsAuthentication.SetAuthCookie(viewModel.Login, true);
                    return Json(true);
                }
                ModelState.AddModelError("", "Incorrect login or password.");
            }
            return Json(false);
        }

        public ActionResult Register(string login, string password)
        {
            var membershipUser = ((CustomMembershipProvider)Membership.Provider)
                .CreateUser(login, password);

            if (membershipUser != null)
            {
                FormsAuthentication.SetAuthCookie(login, true);
                return Json(true);
            }
            return Json(false);
        }
    }
}
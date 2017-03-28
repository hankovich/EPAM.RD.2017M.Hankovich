using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Security;
using EPAM.RD._2017M.Hankovich.Models;
using EPAM.RD._2017M.Hankovich.Providers;

namespace EPAM.RD._2017M.Hankovich.Controllers
{
    public class AccountController : Controller
    {
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
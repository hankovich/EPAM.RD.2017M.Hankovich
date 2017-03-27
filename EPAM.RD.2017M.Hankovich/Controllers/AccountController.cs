using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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
            return RedirectToAction("Login", "Account");
        }

        public bool IsAuthenticated()
        {
            return User.Identity.IsAuthenticated;
        }

        public bool IsInRole(string role)
        {
            return User.IsInRole(role);
        }

        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            if (Request.IsAjaxRequest())
            {
                return PartialView();
            }
            return View();
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
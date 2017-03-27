using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EPAM.RD._2017M.Hankovich.Models
{
    public class RegisterModel
    {
        [ScaffoldColumn(false)]
        public int Id { get; set; }

        [Display(Name = "Enter login")]
        [Required(ErrorMessage = "The field can not be empty!")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Enter password")]
        [StringLength(100, ErrorMessage = "The password must contain at least {2} characters", MinimumLength = 8)]
        [DataType(DataType.Password)]
        [Display(Name = "Enter password")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm password")]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Passwords must match")]
        public string ConfirmPassword { get; set; }
    }
}
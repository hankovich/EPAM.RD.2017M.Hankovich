using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EPAM.RD._2017M.Hankovich.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "The field can not be empty!")]
        [Display(Name = "Enter login")]
        public string Login { get; set; }

        [Required(ErrorMessage = "The field can not be empty!")]
        [DataType(DataType.Password)]
        [Display(Name = "Enter password")]
        public string Password { get; set; }
    }
}
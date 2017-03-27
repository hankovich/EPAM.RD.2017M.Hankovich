using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Security;
using EPAM.RD._2017M.Hankovich.ORM;

namespace EPAM.RD._2017M.Hankovich.Providers
{
    public class CustomRoleProvider : RoleProvider
    {
        private readonly GalleryModel model = new GalleryModel();
        public override bool IsUserInRole(string login, string roleName)
        {
            var roleId = model.Users.FirstOrDefault(user => user.Login == login)?.Role.Id;
            if (roleId == null)
                return false;
            return Enumerable.FirstOrDefault(model.Roles.Select(role => role.Id == roleId.Value));
        }

        public override string[] GetRolesForUser(string login)
        {
            var roleName = model.Users.FirstOrDefault(user => user.Login == login)?.Role.Name;
            if (roleName == null)
                return null;
            return new[] { roleName };
        }

        public override void CreateRole(string roleName)
        {
            model.Roles.Add(new Role { Name = roleName });
            model.SaveChanges();
        }

        #region stabs
        public override bool DeleteRole(string roleName, bool throwOnPopulatedRole)
        {
            throw new NotImplementedException();
        }

        public override bool RoleExists(string roleName)
        {
            throw new NotImplementedException();
        }

        public override void AddUsersToRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
        }

        public override void RemoveUsersFromRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
        }

        public override string[] GetUsersInRole(string roleName)
        {
            throw new NotImplementedException();
        }

        public override string[] GetAllRoles()
        {
            throw new NotImplementedException();
        }

        public override string[] FindUsersInRole(string roleName, string usernameToMatch)
        {
            throw new NotImplementedException();
        }

        public override string ApplicationName { get; set; }
        #endregion
    }
}
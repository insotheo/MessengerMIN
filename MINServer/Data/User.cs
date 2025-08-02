using System;
using System.Linq;

namespace MINServer.Data
{
    public class User
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Bio { get; set; }
        public string RegistrationDate { get; set; }
        public string LastSeenDate { get; set; }
        public string ProfilePhoto { get; set; }
        public int? ShowLastSeen { get; set; }
        public int? AutoAccountDeleteAfterInDays { get; set; } //max 5

        public User() { }

        public User(MessengerDbContext ctx, string name, string username, string passwordHash)
        {
            this.Id = (ctx.Users.Any() ? ctx.Users.Max(u => u.Id) + 1 : 1);

            this.Name = name;
            this.Username = username;
            this.PasswordHash = passwordHash;

            this.Bio = "";
            this.RegistrationDate = DateTime.Now.ToString("O");
            this.LastSeenDate = DateTime.Now.ToString("O");
            this.ProfilePhoto = "";
            this.ShowLastSeen = 0;
            this.AutoAccountDeleteAfterInDays = 3;
        }
    }
}

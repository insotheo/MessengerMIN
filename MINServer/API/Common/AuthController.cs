using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MINServer.Data;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MINServer.API.Common
{
    [Route("/common_api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MessengerDbContext _ctx;
        private readonly IConfiguration _config;

        public AuthController(MessengerDbContext ctx, IConfiguration config)
        {
            _ctx = ctx;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser()
        {
            var data = Request.Form;

            string name = data["name"];
            string username = data["username"];
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(data["password"]);

            if(String.IsNullOrWhiteSpace(name) || String.IsNullOrWhiteSpace(username) || String.IsNullOrWhiteSpace(passwordHash))
            {
                return BadRequest("All fields are required!");
            }

            if (_ctx.Users.Any(u => u.Username == username))
            {
                return BadRequest("User with such username already exists!");
            }

            User newUser = new User(_ctx, name, username, passwordHash);
            _ctx.Users.Add(newUser);
            await _ctx.SaveChangesAsync();

            return Ok(new {Message = "Success registration"});
        }

        [HttpPost("login")]
        public IActionResult Login()
        {
            try
            {
                var form = Request.Form;
                string username = form["username"];
                string password = form["password"];

                if (!_ctx.Users.Any())
                {
                    return Unauthorized("User not found!");
                }

                User user = _ctx.Users.FirstOrDefault(u => u.Username == username);
                if (user == null)
                {
                    return Unauthorized("User not found!");
                }

                if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    return Unauthorized("Invalid username or password.");
                }

                var token = GenerateJwtToken(user);

                Response.Cookies.Append("jwtToken", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.Now.AddHours(1),
                    Path = "/"
                });
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok(new { Message = "Login successful" });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings["Key"]));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, System.Guid.NewGuid().ToString()),
                new Claim("userId", user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: System.DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

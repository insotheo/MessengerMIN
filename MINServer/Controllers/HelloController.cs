using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace MINServer.Controllers
{
    [Route("[controller]")]
    public class HelloController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            if(Request.Cookies.ContainsKey("jwtToken") && !string.IsNullOrEmpty(Request.Cookies["jwtToken"]))
            {
                return Redirect("/main");
            }

            return PhysicalFile(
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "hello.html"),
                "text/html"
                );
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace MINServer.Controllers
{
    [Authorize]
    [Route("/main")]
    public class MainController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "main.html"),
                "text/html"
                );
        }
    }
}

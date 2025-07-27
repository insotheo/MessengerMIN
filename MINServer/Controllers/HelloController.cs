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
            return PhysicalFile(
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "hello", "index.html"),
                "text/html"
                );
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using MapeamentoRedeApi.Models;

namespace MapeamentoRedeApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CabosController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<Cabo>> Get()
        {
            var cabos = new List<Cabo>
            {

            };
            return Ok(cabos);
        }
    }
}
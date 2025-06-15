using Microsoft.AspNetCore.Mvc;
using MapeamentoRedeApi.Models;

namespace MapeamentoRedeApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CaixasController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<Caixa>> Get()
        {
            var caixas = new List<Caixa>
            {
                new Caixa { Id = 1, Nome = "Caixa A", Latitude = -22.9, Longitude = -43.2 },
                new Caixa { Id = 2, Nome = "Caixa B", Latitude = -23.0, Longitude = -43.3 }
            };
            return Ok(caixas);
        }
        
    }
}
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
                new Cabo { Id = 1, Nome = "Cabo 1", QuantidadeFibras = 12, CaixaId = 1, Sentido = "Saída", ProximaCaixaEndereco = "Rua das Flores, 100" },
                new Cabo { Id = 2, Nome = "Cabo 2", QuantidadeFibras = 24, CaixaId = 2, Sentido = "Entrada", ProximaCaixaEndereco = "Av. Brasil, 200" }
            };
            return Ok(cabos);
        }
    }
}
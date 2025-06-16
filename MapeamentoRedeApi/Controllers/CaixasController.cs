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

            };
            return Ok(caixas);
        }
        
    }
}
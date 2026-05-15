using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EpisodesController(IRickAndMortyService service) : ControllerBase
    {
        private readonly IRickAndMortyService _service = service;

        [HttpGet]
        public async Task<IActionResult> ObtenerEpisodios(
            [FromQuery] int pagina = 1,
            [FromQuery] string? nombre = null,
            [FromQuery] string? temporada = null)
        {
            var episodios = await _service.ObtenerEpisodiosAsync(pagina, nombre, temporada);
            return Ok(episodios);
        }
    }
}

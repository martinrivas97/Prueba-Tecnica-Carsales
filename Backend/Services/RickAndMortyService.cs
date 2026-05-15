using Backend.Clients;
using Backend.Models.Response;

namespace Backend.Services
{
    public interface IRickAndMortyService
    {
        Task<EpisodeResponse> ObtenerEpisodiosAsync(int pagina, string? nombre, string? temporada);
    }

    public class RickAndMortyService(IRickAndMortyClient client) : IRickAndMortyService
    {
        private readonly IRickAndMortyClient _client = client;

        public async Task<EpisodeResponse> ObtenerEpisodiosAsync(int pagina, string? nombre, string? temporada)
        {
            var paginaNormalizada = pagina < 1 ? 1 : pagina;
            var respuesta = await _client.ObtenerEpisodiosAsync(paginaNormalizada, nombre, temporada);

            if (respuesta is null)
            {
                return EpisodeResponse.Empty();
            }

            return respuesta;
        }
    }
}

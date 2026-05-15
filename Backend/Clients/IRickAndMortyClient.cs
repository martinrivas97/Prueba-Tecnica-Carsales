using Backend.Models.Response;

namespace Backend.Clients
{
    public interface IRickAndMortyClient
    {
        Task<EpisodeResponse?> ObtenerEpisodiosAsync(int pagina, string? nombre, string? temporada);
    }
}

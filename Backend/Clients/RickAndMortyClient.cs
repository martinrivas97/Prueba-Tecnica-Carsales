using System.Net;
using Backend.Models.Response;

namespace Backend.Clients
{
    public class RickAndMortyClient(HttpClient httpClient) : IRickAndMortyClient
    {
        private readonly HttpClient _httpClient = httpClient;

        public async Task<EpisodeResponse?> ObtenerEpisodiosAsync(int pagina, string? nombre, string? temporada)
        {
            var parametros = new List<string> { $"page={pagina}" };

            if (!string.IsNullOrWhiteSpace(nombre))
            {
                parametros.Add($"name={Uri.EscapeDataString(nombre)}");
            }

            if (!string.IsNullOrWhiteSpace(temporada) && temporada != "Todas")
            {
                parametros.Add($"episode={Uri.EscapeDataString(temporada)}");
            }

            var ruta = $"episode?{string.Join("&", parametros)}";
            var respuesta = await _httpClient.GetAsync(ruta);

            if (respuesta.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }

            respuesta.EnsureSuccessStatusCode();
            return await respuesta.Content.ReadFromJsonAsync<EpisodeResponse>();
        }
    }
}

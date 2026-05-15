using Backend.Models;
using System.Text.Json.Serialization;

namespace Backend.Models.Response
{
    public class EpisodeResponse
    {
        [JsonPropertyName("info")]
        public Info Info { get; set; } = new() { Pages = 1 };

        [JsonPropertyName("results")]
        public List<Episode> Results { get; set; } = [];

        public static EpisodeResponse Empty()
        {
            return new EpisodeResponse
            {
                Info = new Info { Count = 0, Pages = 1 },
                Results = []
            };
        }
    }
}

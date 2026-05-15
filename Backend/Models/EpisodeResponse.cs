using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Episode
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public required string Name { get; set; }

        [JsonPropertyName("air_date")]
        public required string AirDate { get; set; }

        [JsonPropertyName("episode")]
        public required string EpisodeCode { get; set; }

        [JsonPropertyName("characters")]
        public List<string> Characters { get; set; } = [];

        [JsonPropertyName("url")]
        public string? Url { get; set; }

        [JsonPropertyName("created")]
        public string? Created { get; set; }
    }
}

namespace Backend.Configuration
{
    public class RickAndMortyApiOptions
    {
        public const string SectionName = "RickAndMortyApi";

        public required string BaseUrl { get; init; }
    }
}

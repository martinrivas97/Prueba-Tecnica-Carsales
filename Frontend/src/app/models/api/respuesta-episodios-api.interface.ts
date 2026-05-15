export interface EpisodioApi {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

export interface RespuestaEpisodiosApi {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: EpisodioApi[];
}

import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Episodio } from '../models/episode.interface';
import { EpisodioApi, RespuestaEpisodiosApi } from '../models/api/respuesta-episodios-api.interface';

@Injectable({ providedIn: 'root' })
export class EpisodeService {
  private readonly clienteHttp = inject(HttpClient);
  private readonly urlApi = environment.apiUrl;
  private readonly claveFavoritos = 'rm_favs_data';

  episodios = signal<Episodio[]>([]);
  cargando = signal<boolean>(false);
  mensajeError = signal<string | null>(null);
  paginaActual = signal<number>(1);
  totalPaginas = signal<number>(1);
  terminoBusqueda = signal<string>('');
  temporadaSeleccionada = signal<string>('Todas');
  favoritos = signal<Episodio[]>(this.cargarFavoritos());

  episodiosOrdenados = computed(() => {
    const episodiosActuales = [...this.episodios()];
    const favoritosActuales = this.favoritos();
    const pagina = this.paginaActual();
    const tieneFiltros = this.terminoBusqueda().trim() !== '' || this.temporadaSeleccionada() !== 'Todas';

    if (tieneFiltros) {
      return episodiosActuales.sort((a, b) => {
        const aEsFavorito = favoritosActuales.some(f => f.id === a.id);
        const bEsFavorito = favoritosActuales.some(f => f.id === b.id);

        if (aEsFavorito && !bEsFavorito) return -1;
        if (!aEsFavorito && bEsFavorito) return 1;
        return 0;
      });
    }

    const episodiosNoFavoritos = episodiosActuales.filter(
      episodio => !favoritosActuales.some(favorito => favorito.id === episodio.id)
    );

    if (pagina === 1) {
      return [...favoritosActuales, ...episodiosNoFavoritos];
    }

    return episodiosNoFavoritos;
  });

  cargarEpisodios(pagina: number = 1) {
    this.cargando.set(true);
    this.mensajeError.set(null);

    const nombre = this.terminoBusqueda();
    const temporada = this.temporadaSeleccionada();

    let consulta = `?pagina=${pagina}`;
    if (nombre) consulta += `&nombre=${encodeURIComponent(nombre)}`;
    if (temporada !== 'Todas') consulta += `&temporada=${encodeURIComponent(temporada)}`;

    this.clienteHttp.get<RespuestaEpisodiosApi>(`${this.urlApi}${consulta}`)
      .pipe(
        catchError(error => {
          this.mensajeError.set('Error al conectar con el servidor.');
          return throwError(() => error);
        }),
        finalize(() => this.cargando.set(false))
      )
      .subscribe({
        next: (respuesta) => {
          const episodios = respuesta.results.map(episodio => this.convertirEpisodioApi(episodio));

          this.episodios.set(episodios);
          this.paginaActual.set(pagina);
          this.totalPaginas.set(respuesta.info.pages);
        }
      });
  }

  alternarFavorito(episodio: Episodio) {
    const favoritosActuales = this.favoritos();
    const esFavorito = favoritosActuales.some(favorito => favorito.id === episodio.id);

    if (esFavorito) {
      this.favoritos.set(favoritosActuales.filter(favorito => favorito.id !== episodio.id));
    } else {
      this.favoritos.set([...favoritosActuales, episodio]);
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.claveFavoritos, JSON.stringify(this.favoritos()));
    }
  }

  esFavorito(id: number): boolean {
    return this.favoritos().some(favorito => favorito.id === id);
  }

  private cargarFavoritos(): Episodio[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const guardados = localStorage.getItem(this.claveFavoritos);

      if (!guardados) {
        return [];
      }

      try {
        const datosGuardados: unknown = JSON.parse(guardados);

        if (!Array.isArray(datosGuardados)) {
          return [];
        }

        const favoritos = datosGuardados
          .map(valor => this.convertirFavoritoGuardado(valor))
          .filter((episodio): episodio is Episodio => episodio !== null);

        localStorage.setItem(this.claveFavoritos, JSON.stringify(favoritos));
        return favoritos;
      } catch {
        localStorage.removeItem(this.claveFavoritos);
      }
    }

    return [];
  }

  private convertirEpisodioApi(episodio: EpisodioApi): Episodio {
    return {
      id: episodio.id,
      nombre: episodio.name,
      fechaEstreno: episodio.air_date,
      codigoEpisodio: episodio.episode,
      personajes: episodio.characters
    };
  }

  private convertirFavoritoGuardado(valor: unknown): Episodio | null {
    if (!this.esObjeto(valor)) {
      return null;
    }

    const id = typeof valor['id'] === 'number' ? valor['id'] : null;
    const nombre = this.obtenerTexto(valor, 'nombre', 'name');
    const fechaEstreno = this.obtenerTexto(valor, 'fechaEstreno', 'air_date');
    const codigoEpisodio = this.obtenerTexto(valor, 'codigoEpisodio', 'episode');
    const personajes = this.obtenerListaTexto(valor, 'personajes', 'characters');

    if (id === null || nombre === null || fechaEstreno === null || codigoEpisodio === null || personajes === null) {
      return null;
    }

    return {
      id,
      nombre,
      fechaEstreno,
      codigoEpisodio,
      personajes
    };
  }

  private obtenerTexto(objeto: Record<string, unknown>, claveActual: string, claveAnterior: string): string | null {
    const valorActual = objeto[claveActual];
    const valorAnterior = objeto[claveAnterior];

    if (typeof valorActual === 'string') {
      return valorActual;
    }

    if (typeof valorAnterior === 'string') {
      return valorAnterior;
    }

    return null;
  }

  private obtenerListaTexto(objeto: Record<string, unknown>, claveActual: string, claveAnterior: string): string[] | null {
    const valorActual = objeto[claveActual];
    const valorAnterior = objeto[claveAnterior];
    const lista = Array.isArray(valorActual) ? valorActual : valorAnterior;

    if (!Array.isArray(lista)) {
      return null;
    }

    return lista.filter((valor): valor is string => typeof valor === 'string');
  }

  private esObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === 'object' && valor !== null;
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpisodeService } from './service/episode.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  servicioEpisodios = inject(EpisodeService);

  ngOnInit() {
    this.servicioEpisodios.cargarEpisodios(1);
  }

  buscarPorNombre(event: Event) {
    const input = event.target as HTMLInputElement;
    this.servicioEpisodios.terminoBusqueda.set(input.value);
    this.servicioEpisodios.cargarEpisodios(1);
  }

  filtrarPorTemporada(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.servicioEpisodios.temporadaSeleccionada.set(select.value);
    this.servicioEpisodios.cargarEpisodios(1);
  }
}

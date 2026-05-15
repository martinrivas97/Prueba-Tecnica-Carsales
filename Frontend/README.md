# Frontend

Aplicación Angular para visualizar episodios de Rick and Morty a través del BFF desarrollado en .NET.

## Funcionalidades

- Listado de episodios con tarjetas responsivas.
- Paginación desde el backend.
- Búsqueda por nombre de episodio.
- Filtro por temporada.
- Favoritos persistidos en el navegador.
- Estado de carga y mensaje de error para el usuario.

## Configuración

La URL del backend está en:

```ts
src/environments/environment.ts
```

Por defecto apunta a:

```ts
http://localhost:5076/api/episodes
```

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm start
```

Abrir `http://localhost:4200`.

## Compilar

```bash
npm run build
```

El resultado se genera en `dist/`.

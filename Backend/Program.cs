using Backend.Clients;
using Backend.Configuration;
using Backend.Middlewares;
using Backend.Services;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? throw new InvalidOperationException("No se configuraron los origenes");

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularCors", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddOptions<RickAndMortyApiOptions>()
    .Bind(builder.Configuration.GetSection(RickAndMortyApiOptions.SectionName))
    .Validate(options => !string.IsNullOrWhiteSpace(options.BaseUrl), "La URL base de Rick and Morty API es obligatoria.")
    .ValidateOnStart();

builder.Services.AddHttpClient<IRickAndMortyClient, RickAndMortyClient>((serviceProvider, client) =>
{
    var options = serviceProvider.GetRequiredService<IOptions<RickAndMortyApiOptions>>().Value;
    client.BaseAddress = new Uri(options.BaseUrl);
});

builder.Services.AddScoped<IRickAndMortyService, RickAndMortyService>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();
app.UseCors("AngularCors");
app.UseAuthorization();
app.MapControllers();
app.Run();

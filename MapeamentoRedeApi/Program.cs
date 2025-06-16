using Microsoft.EntityFrameworkCore;
using MapeamentoRedeApi;

var builder = WebApplication.CreateBuilder(args);

// Configura o DbContext com PostgreSQL
builder.Services.AddDbContext<MapeamentoRedeContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adiciona serviços necessários
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configurações do pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();

// Mapeia os controllers
app.MapControllers();

app.Run();
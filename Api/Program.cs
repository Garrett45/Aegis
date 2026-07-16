using Api.Shared.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("AegisContext") ??
                       throw new InvalidOperationException("Connection string 'AegisContext' not found.");

builder.Services.AddDbContext<AegisContext>(options => options.UseSqlServer(connectionString));

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        // configure policy based on environment. for development, fine to just let anything
        // request it. need to be more strict for specific hosts when running this for real
        if (builder.Environment.IsDevelopment())
        {
            Console.WriteLine("SETTING CORS");
            policy.AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin();
        }
    });
});

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) app.MapOpenApi();

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
using Api.InitiativeLists;
using Api.Shared;
using Api.Shared.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
            policy.AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var bearerConfig = builder.Configuration.GetSection("Authentication:Schemes:Bearer");

        options.Authority = bearerConfig["Authority"];
        // options.MetadataAddress = bearerConfig["MetadataAddress"] ?? "";
        options.Audience = bearerConfig["Audience"];
        options.RequireHttpsMetadata = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = bearerConfig["ValidIssuer"]
        };
    });

// recommended to require auth and opt out with [AllowAnonymous]: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-oidc-web-authentication?view=aspnetcore-10.0
var requireAuthPolicy = new AuthorizationPolicyBuilder()
    .RequireAuthenticatedUser()
    .Build();

builder.Services.AddAuthorizationBuilder()
    .SetFallbackPolicy(requireAuthPolicy);

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<GetOrCreateAccount>();
builder.Services.AddInitiativeListServices();

var app = builder.Build();

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) app.MapOpenApi();
if (!app.Environment.IsDevelopment()) app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
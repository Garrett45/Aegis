using Api.InitiativeLists.CreateInitiativeList;
using Api.InitiativeLists.DuplicateInitiativeList;
using Api.InitiativeLists.Shared;

namespace Api.InitiativeLists;

public static class RegisterInitiativeListServices
{
    public static IServiceCollection AddInitiativeListServices(this IServiceCollection services)
    {
        services.AddScoped<InitiativeListMapper>();
        services.AddScoped<CreateInitiativeListCommand>();
        services.AddScoped<DuplicateInitiativeListCommand>();
        services.AddScoped<UpdateInitiativeListCommand>();

        return services;
    }
}
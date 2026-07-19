using Api.InitiativeLists.DuplicateInitiativeList;

namespace Api.InitiativeLists;

public static class RegisterInitiativeListServices
{
    public static IServiceCollection AddInitiativeListServices(this IServiceCollection services)
    {
        services.AddScoped<InitiativeListMapper>();
        services.AddScoped<DuplicateInitiativeListCommand>();

        return services;
    }
}
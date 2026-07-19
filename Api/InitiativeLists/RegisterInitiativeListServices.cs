using Api.InitiativeLists.DuplicateInitiativeList;

namespace Api.InitiativeLists;

public static class RegisterInitiativeListServices
{
    public static IServiceCollection AddInitiativeListServices(this IServiceCollection services)
    {
        services.AddScoped<DuplicateInitiativeListCommand>();

        return services;
    }
}
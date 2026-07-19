using Api.InitiativeLists.CreateInitiativeList;
using Api.InitiativeLists.Dto;
using Api.InitiativeLists.DuplicateInitiativeList;
using Api.InitiativeLists.Shared;
using Api.Shared;
using Api.Shared.EntityFrameworkCore.Models;

namespace Api.InitiativeLists;

public static class RegisterInitiativeListServices
{
    public static IServiceCollection AddInitiativeListServices(this IServiceCollection services)
    {
        services.AddScoped<IMapper<InitiativeList, InitiativeListDto>, InitiativeListInitiativeListDtoMapper>();
        services
            .AddScoped<IMapper<InitiativeList, InitiativeListBasicResponse>,
                InitiativeListInitiativeListBasicResponseMapper>();
        services.AddScoped<CreateInitiativeListCommand>();
        services.AddScoped<DuplicateInitiativeListCommand>();
        services.AddScoped<UpdateInitiativeListCommand>();

        return services;
    }
}
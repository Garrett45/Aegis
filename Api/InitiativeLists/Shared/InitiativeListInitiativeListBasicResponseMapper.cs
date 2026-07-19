using Api.Shared;
using Api.Shared.EntityFrameworkCore.Models;

namespace Api.InitiativeLists.Shared;

public class InitiativeListInitiativeListBasicResponseMapper : IMapper<InitiativeList, InitiativeListBasicResponse>
{
    public Task<InitiativeListBasicResponse> Map(InitiativeList objectToMap)
    {
        return Task.FromResult(new InitiativeListBasicResponse(
            objectToMap.Id,
            objectToMap.AccountId,
            objectToMap.Name,
            objectToMap.Round
        ));
    }
}
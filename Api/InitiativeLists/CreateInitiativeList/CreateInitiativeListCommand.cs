using Api.InitiativeLists.Shared;
using Api.Shared;
using Api.Shared.EntityFrameworkCore;
using Api.Shared.EntityFrameworkCore.Models;

namespace Api.InitiativeLists.CreateInitiativeList;

public class CreateInitiativeListCommand(
    AegisContext context,
    IMapper<InitiativeList, InitiativeListBasicResponse> initiativeListMapper)
{
    public async Task<InitiativeListBasicResponse> Execute(CreateInitiativeListRequest initiativeListRequest,
        Account currentAccount)
    {
        var initiativeList = new InitiativeList
        {
            AccountId = currentAccount.Id,
            Name = initiativeListRequest.Name,
            Round = 1
        };
        context.InitiativeLists.Add(initiativeList);
        await context.SaveChangesAsync();

        return await initiativeListMapper.Map(initiativeList);
    }
}
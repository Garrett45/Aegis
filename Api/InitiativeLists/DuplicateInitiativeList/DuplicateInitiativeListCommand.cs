using Api.InitiativeLists.Shared;
using Api.Shared.EntityFrameworkCore;
using Api.Shared.EntityFrameworkCore.Models;

namespace Api.InitiativeLists.DuplicateInitiativeList;

public class DuplicateInitiativeListCommand(AegisContext context)
{
    public async Task<InitiativeListBasicResponse> Execute(int id,
        DuplicateInitiativeListRequest request, Account currentAccount)
    {
        var initiativeList = await context.InitiativeLists.FindAsync(id);
        if (initiativeList is null) throw new InvalidOperationException("Could not find initiative list");

        var newInitiativeList = new InitiativeList
        {
            AccountId = currentAccount.Id,
            Name = request.Name,
            Round = initiativeList.Round
        };
        await context.InitiativeLists.AddAsync(newInitiativeList);
        await context.SaveChangesAsync();

        var initiativeListItems = context.InitiativeListItems
            .Where(initiativeListItem => initiativeListItem.InitiativeListId == initiativeList.Id)
            .ToList();
        foreach (var initiativeListItem in initiativeListItems)
            await context.InitiativeListItems.AddAsync(new InitiativeListItem
            {
                InitiativeListId = newInitiativeList.Id,
                Initiative = initiativeListItem.Initiative,
                InitiativeBonus = initiativeListItem.InitiativeBonus,
                Name = initiativeListItem.Name,
                Hp = initiativeListItem.Hp,
                Ac = initiativeListItem.Ac,
                IsActive = initiativeListItem.IsActive,
                SortOrder = initiativeListItem.SortOrder
            });
        await context.SaveChangesAsync();

        return new InitiativeListBasicResponse(
            newInitiativeList.Id,
            newInitiativeList.AccountId,
            newInitiativeList.Name,
            newInitiativeList.Round
        );
    }
}
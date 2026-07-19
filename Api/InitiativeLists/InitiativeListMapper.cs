using Api.Shared.EntityFrameworkCore;
using Api.Shared.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.InitiativeLists;

public class InitiativeListMapper(AegisContext context)
{
    public async Task<InitiativeListDto> MapInitiativeListToDto(InitiativeList initiativeList)
    {
        var initiativeListItems = await context.InitiativeListItems
            .Where(initiativeListItem => initiativeListItem.InitiativeListId == initiativeList.Id)
            .Select(initiativeListItem => new InitiativeListItemDto(
                initiativeListItem.Id.ToString(),
                initiativeListItem.Initiative,
                initiativeListItem.InitiativeBonus,
                initiativeListItem.Name,
                initiativeListItem.Hp,
                initiativeListItem.Ac,
                initiativeListItem.SortOrder
            ))
            .ToListAsync();
        var activeInitiativeItem = await context.InitiativeListItems
            .FirstOrDefaultAsync(initiativeListItem =>
                initiativeListItem.InitiativeListId == initiativeList.Id && initiativeListItem.IsActive);

        return new InitiativeListDto(
            initiativeList.Id,
            initiativeList.Name,
            initiativeList.Round,
            activeInitiativeItem?.Id.ToString() ?? "",
            initiativeListItems
        );
    }
}
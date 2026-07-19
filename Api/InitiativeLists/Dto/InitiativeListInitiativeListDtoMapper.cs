using Api.Shared;
using Api.Shared.EntityFrameworkCore;
using Api.Shared.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.InitiativeLists.Dto;

public class InitiativeListInitiativeListDtoMapper(AegisContext context) : IMapper<InitiativeList, InitiativeListDto>
{
    public async Task<InitiativeListDto> Map(InitiativeList objectToMap)
    {
        var initiativeListItems = await context.InitiativeListItems
            .Where(initiativeListItem => initiativeListItem.InitiativeListId == objectToMap.Id)
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
                initiativeListItem.InitiativeListId == objectToMap.Id && initiativeListItem.IsActive);

        return new InitiativeListDto(
            objectToMap.Id,
            objectToMap.Name,
            objectToMap.Round,
            activeInitiativeItem?.Id.ToString() ?? "",
            initiativeListItems
        );
    }
}
using Api.Shared.EntityFrameworkCore;
using Api.Shared.EntityFrameworkCore.Models;

namespace Api.InitiativeLists;

public class UpdateInitiativeListCommand(AegisContext context, InitiativeListMapper initiativeListMapper)
{
    public async Task<InitiativeListDto> Execute(InitiativeListDto initiativeListDto, Account currentAccount)
    {
        // Since EF core caches it, we can just pull the initiative list again, and this saves us from a weird parameter list
        // The account on the other hand, is best just provided by the controller, which already has the info
        var initiativeList = await context.InitiativeLists.FindAsync(initiativeListDto.Id);
        if (initiativeList is null)
            throw new InvalidOperationException($"Could not find initiative list {initiativeListDto.Id}");

        initiativeList.AccountId = currentAccount.Id;
        initiativeList.Name = initiativeListDto.Name;
        initiativeList.Round = initiativeListDto.Round;
        initiativeList.UpdatedAt = DateTime.UtcNow;

        // I could make this update only the required. In fact, the original design did just that.
        // However, with performance being so good, and the current design meaning updates almost
        // never happen, it kind of just makes more sense to clear everything and re-add it,
        // particularly since we aren't even using this data except on initial page load, and
        // since this significantly simplifies the code
        var currentInitiativeListItems = context.InitiativeListItems
            .Where(initiativeListItem => initiativeListItem.InitiativeListId == initiativeListDto.Id)
            .ToList();
        foreach (var initiativeListItem in currentInitiativeListItems)
            context.InitiativeListItems.Remove(initiativeListItem);

        foreach (var initiativeListItemDto in initiativeListDto.InitiativeListItems)
            await context.InitiativeListItems.AddAsync(new InitiativeListItem
            {
                InitiativeListId = initiativeListDto.Id,
                Initiative = initiativeListItemDto.Initiative,
                InitiativeBonus = initiativeListItemDto.InitiativeBonus,
                Name = initiativeListItemDto.Name,
                Hp = initiativeListItemDto.Hp,
                Ac = initiativeListItemDto.Ac,
                IsActive = initiativeListDto.ActiveId == initiativeListItemDto.Id,
                SortOrder = initiativeListItemDto.SortOrder
            });

        await context.SaveChangesAsync();
        return await initiativeListMapper.MapInitiativeListToDto(initiativeList);
    }
}
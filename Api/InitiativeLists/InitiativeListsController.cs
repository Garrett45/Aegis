using Api.Shared;
using Api.Shared.EntityFrameworkCore;
using Api.Shared.EntityFrameworkCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.InitiativeLists;

[Route("api/[controller]")]
[ApiController]
public class InitiativeListsController(AegisContext context, GetOrCreateAccount getOrCreateAccount) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InitiativeListBasicResponse>>> GetInitiativeList()
    {
        var currentAccount = await getOrCreateAccount.Execute(User);

        return await context.InitiativeLists
            .Where(initiativeList => initiativeList.AccountId == currentAccount.Id)
            .OrderByDescending(initiativeList => initiativeList.UpdatedAt)
            .Select(initiativeList => new InitiativeListBasicResponse(
                initiativeList.Id,
                initiativeList.AccountId,
                initiativeList.Name,
                initiativeList.Round
            ))
            .ToListAsync();
    }

    private async Task<InitiativeListDto> MapInitiativeListToDto(InitiativeList initiativeList)
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

    [HttpGet("{id}")]
    public async Task<ActionResult<InitiativeList>> GetInitiativeList(int id)
    {
        var initiativeList = await context.InitiativeLists.FindAsync(id);
        if (initiativeList is null) return BadRequest("Could not find initiative list");

        var currentAccount = await getOrCreateAccount.Execute(User);
        if (initiativeList.AccountId != currentAccount.Id) return Forbid();

        return Ok(await MapInitiativeListToDto(initiativeList));
    }

    [HttpPost]
    public async Task<ActionResult<InitiativeListBasicResponse>> CreateInitiativeList(
        CreateInitiativeListRequest initiativeListRequest)
    {
        var currentAccount = await getOrCreateAccount.Execute(User);

        var initiativeList = new InitiativeList
        {
            AccountId = currentAccount.Id,
            Name = initiativeListRequest.Name,
            Round = 1
        };
        context.InitiativeLists.Add(initiativeList);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetInitiativeList", new { id = initiativeList.Id }, new InitiativeListBasicResponse(
            initiativeList.Id,
            initiativeList.AccountId,
            initiativeList.Name,
            initiativeList.Round
        ));
    }

    [HttpPost("{id}/duplicate")]
    public async Task<ActionResult<InitiativeListBasicResponse>> DuplicateInitiativeList(int id,
        DuplicateInitiativeListRequest request)
    {
        var initiativeList = await context.InitiativeLists.FindAsync(id);
        if (initiativeList is null) return BadRequest("Could not find initiative list");

        var currentAccount = await getOrCreateAccount.Execute(User);
        if (initiativeList.AccountId != currentAccount.Id) return Forbid();

        var newInitiativeList = new InitiativeList
        {
            AccountId = initiativeList.Id,
            Name = request.Name,
            Round = initiativeList.Round
        };
        await context.InitiativeLists.AddAsync(newInitiativeList);
        await context.SaveChangesAsync();

        var initiativeListItems = context.InitiativeListItems
            .Where(initiativeListItem => initiativeListItem.InitiativeListId == id)
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

        return CreatedAtAction("GetInitiativeList", new { id = newInitiativeList.Id }, new InitiativeListBasicResponse(
            newInitiativeList.Id,
            newInitiativeList.AccountId,
            newInitiativeList.Name,
            newInitiativeList.Round
        ));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutInitiativeList(int id, InitiativeListDto initiativeListDto)
    {
        if (id != initiativeListDto.Id) return BadRequest("Initiative list ID does not match ID in URL");

        var initiativeList = await context.InitiativeLists.FindAsync(id);
        if (initiativeList is null) return BadRequest("Could not find initiative list");

        var currentAccount = await getOrCreateAccount.Execute(User);
        if (initiativeList.AccountId != currentAccount.Id) return Forbid();

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
            .Where(initiativeListItem => initiativeListItem.InitiativeListId == id)
            .ToList();
        foreach (var initiativeListItem in currentInitiativeListItems)
            context.InitiativeListItems.Remove(initiativeListItem);

        foreach (var initiativeListItemDto in initiativeListDto.InitiativeListItems)
            await context.InitiativeListItems.AddAsync(new InitiativeListItem
            {
                InitiativeListId = id,
                Initiative = initiativeListItemDto.Initiative,
                InitiativeBonus = initiativeListItemDto.InitiativeBonus,
                Name = initiativeListItemDto.Name,
                Hp = initiativeListItemDto.Hp,
                Ac = initiativeListItemDto.Ac,
                IsActive = initiativeListDto.ActiveId == initiativeListItemDto.Id,
                SortOrder = initiativeListItemDto.SortOrder
            });

        await context.SaveChangesAsync();
        return Ok(await MapInitiativeListToDto(initiativeList));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInitiativeList(int? id)
    {
        var initiativeList = await context.InitiativeLists.FindAsync(id);
        if (initiativeList == null) return NotFound();

        var currentAccount = await getOrCreateAccount.Execute(User);
        if (initiativeList.AccountId != currentAccount.Id) return Forbid();

        context.InitiativeLists.Remove(initiativeList);

        var currentInitiativeListItems = context.InitiativeListItems
            .Where(initiativeListItem => initiativeListItem.InitiativeListId == id)
            .ToList();
        foreach (var initiativeListItem in currentInitiativeListItems)
            context.InitiativeListItems.Remove(initiativeListItem);

        await context.SaveChangesAsync();
        return NoContent();
    }
}
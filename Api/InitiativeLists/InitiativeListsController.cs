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
        var initiativeItems = await context.InitiativeItems
            .Where(initiativeItem => initiativeItem.InitiativeListId == initiativeList.Id)
            .Select(initiativeItem => new InitiativeItemDto(
                initiativeItem.Id.ToString(),
                initiativeItem.Initiative,
                initiativeItem.InitiativeBonus,
                initiativeItem.Name,
                initiativeItem.Hp,
                initiativeItem.Ac,
                initiativeItem.SortOrder
            ))
            .ToListAsync();
        var activeInitiativeItem = await context.InitiativeItems
            .FirstOrDefaultAsync(initiativeItem =>
                initiativeItem.InitiativeListId == initiativeList.Id && initiativeItem.IsActive);

        return new InitiativeListDto(
            initiativeList.Id,
            initiativeList.Name,
            initiativeList.Round,
            activeInitiativeItem?.Id.ToString() ?? "",
            initiativeItems
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

        // I could make this update only the required. In fact, the original design did just that.
        // However, with performance being so good, and the current design meaning updates almost
        // never happen, it kind of just makes more sense to clear everything and re-add it,
        // particularly since we aren't even using this data except on initial page load, and
        // since this significantly simplifies the code
        var currentInitiativeItems = context.InitiativeItems
            .Where(initiativeItem => initiativeItem.InitiativeListId == id)
            .ToList();
        foreach (var initiativeItem in currentInitiativeItems) context.InitiativeItems.Remove(initiativeItem);

        foreach (var initiativeItemDto in initiativeListDto.InitiativeItems)
            await context.InitiativeItems.AddAsync(new InitiativeItem
            {
                InitiativeListId = id,
                Initiative = initiativeItemDto.Initiative,
                InitiativeBonus = initiativeItemDto.InitiativeBonus,
                Name = initiativeItemDto.Name,
                Hp = initiativeItemDto.Hp,
                Ac = initiativeItemDto.Ac,
                IsActive = initiativeListDto.ActiveId == initiativeItemDto.Id,
                SortOrder = initiativeItemDto.SortOrder
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

        var currentInitiativeItems = context.InitiativeItems
            .Where(initiativeItem => initiativeItem.InitiativeListId == id)
            .ToList();
        foreach (var initiativeItem in currentInitiativeItems) context.InitiativeItems.Remove(initiativeItem);

        await context.SaveChangesAsync();
        return NoContent();
    }
}
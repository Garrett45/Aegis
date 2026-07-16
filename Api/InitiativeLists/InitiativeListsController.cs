using Api.Shared.EntityFrameworkCore;
using Api.Shared.EntityFrameworkCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.InitiativeLists;

[Route("api/[controller]")]
[ApiController]
public class InitiativeListsController(AegisContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InitiativeListBasicResponse>>> GetInitiativeList()
    {
        // TODO: filter by logged in account once that is added in
        return await context.InitiativeLists
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
            initiativeList.AccountId,
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

        return Ok(await MapInitiativeListToDto(initiativeList));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutInitiativeList(int id, InitiativeListDto initiativeListDto)
    {
        var initiativeList = await context.InitiativeLists.FindAsync(id);
        if (initiativeList is null) return BadRequest("Could not find initiative list");

        initiativeList.AccountId = initiativeListDto.AccountId;
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

    // POST: api/InitiativeList
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<InitiativeList>> PostInitiativeList(InitiativeList initiativelist)
    {
        context.InitiativeLists.Add(initiativelist);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetInitiativeList", new { id = initiativelist.Id }, initiativelist);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInitiativeList(int? id)
    {
        var initiativeList = await context.InitiativeLists.FindAsync(id);
        if (initiativeList == null) return NotFound();

        context.InitiativeLists.Remove(initiativeList);

        var currentInitiativeItems = context.InitiativeItems
            .Where(initiativeItem => initiativeItem.InitiativeListId == id)
            .ToList();
        foreach (var initiativeItem in currentInitiativeItems) context.InitiativeItems.Remove(initiativeItem);

        await context.SaveChangesAsync();
        return NoContent();
    }
}
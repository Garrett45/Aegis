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
    public async Task<ActionResult<IEnumerable<InitiativeList>>> GetInitiativeList()
    {
        return await context.InitiativeLists.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InitiativeList>> GetInitiativeList(int id)
    {
        var initiativelist = await context.InitiativeLists.FindAsync(id);

        if (initiativelist == null) return NotFound();

        return initiativelist;
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

        var initiativeItems = await context.InitiativeItems
            .Where(initiativeItem => initiativeItem.InitiativeListId == id)
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
            .FirstOrDefaultAsync(initiativeItem => initiativeItem.InitiativeListId == id && initiativeItem.IsActive);

        return Ok(new InitiativeListDto(
            initiativeList.AccountId,
            initiativeList.Name,
            initiativeList.Round,
            activeInitiativeItem?.Id.ToString() ?? "",
            initiativeItems
        ));
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

    // DELETE: api/InitiativeList/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInitiativeList(int? id)
    {
        var initiativelist = await context.InitiativeLists.FindAsync(id);
        if (initiativelist == null) return NotFound();

        context.InitiativeLists.Remove(initiativelist);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool InitiativeListExists(int? id)
    {
        return context.InitiativeLists.Any(e => e.Id == id);
    }
}
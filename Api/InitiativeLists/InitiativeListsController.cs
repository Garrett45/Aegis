using Api.InitiativeLists.DuplicateInitiativeList;
using Api.Shared;
using Api.Shared.EntityFrameworkCore;
using Api.Shared.EntityFrameworkCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.InitiativeLists;

[Route("api/[controller]")]
[ApiController]
public class InitiativeListsController(
    AegisContext context,
    GetOrCreateAccount getOrCreateAccount,
    InitiativeListMapper initiativeListMapper,
    DuplicateInitiativeListCommand duplicateInitiativeListCommand,
    UpdateInitiativeListCommand updateInitiativeListCommand) : ControllerBase
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


    [HttpGet("{id}")]
    public async Task<ActionResult<InitiativeList>> GetInitiativeList(int id)
    {
        var initiativeList = await context.InitiativeLists.FindAsync(id);
        if (initiativeList is null) return BadRequest("Could not find initiative list");

        var currentAccount = await getOrCreateAccount.Execute(User);
        if (initiativeList.AccountId != currentAccount.Id) return Forbid();

        return Ok(await initiativeListMapper.MapInitiativeListToDto(initiativeList));
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

        var duplicatedInitiativeList = duplicateInitiativeListCommand.Execute(initiativeList, request, currentAccount);
        return CreatedAtAction("GetInitiativeList", new { id = duplicatedInitiativeList.Id }, duplicatedInitiativeList);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInitiativeList(int id, InitiativeListDto initiativeListDto)
    {
        if (id != initiativeListDto.Id) return BadRequest("Initiative list ID does not match ID in URL");

        var initiativeList = await context.InitiativeLists.FindAsync(id);
        if (initiativeList is null) return BadRequest("Could not find initiative list");

        var currentAccount = await getOrCreateAccount.Execute(User);
        if (initiativeList.AccountId != currentAccount.Id) return Forbid();

        return Ok(await updateInitiativeListCommand.Execute(initiativeList, initiativeListDto, currentAccount));
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
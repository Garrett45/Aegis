using Api.InitiativeLists.CreateInitiativeList;
using Api.InitiativeLists.Dto;
using Api.InitiativeLists.DuplicateInitiativeList;
using Api.InitiativeLists.Shared;
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
    IMapper<InitiativeList, InitiativeListDto> initiativeListDtoMapper,
    CreateInitiativeListCommand createInitiativeListCommand,
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

        return Ok(await initiativeListDtoMapper.Map(initiativeList));
    }

    [HttpPost]
    public async Task<ActionResult<InitiativeListBasicResponse>> CreateInitiativeList(
        CreateInitiativeListRequest initiativeListRequest)
    {
        var currentAccount = await getOrCreateAccount.Execute(User);
        var initiativeList = await createInitiativeListCommand.Execute(initiativeListRequest, currentAccount);
        return CreatedAtAction("GetInitiativeList", new { id = initiativeList.Id }, initiativeList);
    }

    [HttpPost("{id}/duplicate")]
    public async Task<ActionResult<InitiativeListBasicResponse>> DuplicateInitiativeList(int id,
        DuplicateInitiativeListRequest request)
    {
        var initiativeList = await context.InitiativeLists.FindAsync(id);
        if (initiativeList is null) return BadRequest("Could not find initiative list");

        var currentAccount = await getOrCreateAccount.Execute(User);
        if (initiativeList.AccountId != currentAccount.Id) return Forbid();

        var duplicatedInitiativeList = await duplicateInitiativeListCommand.Execute(id, request, currentAccount);
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

        return Ok(await updateInitiativeListCommand.Execute(initiativeListDto, currentAccount));
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
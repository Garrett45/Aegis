namespace Api.InitiativeLists.Shared;

public record InitiativeListDto(
    int Id,
    string Name,
    int Round,
    string ActiveId,
    IEnumerable<InitiativeListItemDto> InitiativeListItems
);
namespace Api.InitiativeLists;

public record InitiativeListDto(
    int Id,
    int AccountId,
    string Name,
    int Round,
    string ActiveId,
    IEnumerable<InitiativeItemDto> InitiativeItems
);
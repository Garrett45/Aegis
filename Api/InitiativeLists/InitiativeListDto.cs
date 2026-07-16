namespace Api.InitiativeLists;

public record InitiativeListDto(
    int AccountId,
    string Name,
    int Round,
    string ActiveId,
    IEnumerable<InitiativeItemDto> InitiativeItems
);
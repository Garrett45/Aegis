namespace Api.InitiativeLists;

public record InitiativeItemDto(
    string Id,
    int? Initiative,
    int? InitiativeBonus,
    string? Name,
    int? Hp,
    int? Ac,
    int SortOrder
);
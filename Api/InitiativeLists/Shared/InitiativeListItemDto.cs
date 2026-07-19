namespace Api.InitiativeLists.Shared;

public record InitiativeListItemDto(
    string Id,
    int? Initiative,
    int? InitiativeBonus,
    string? Name,
    int? Hp,
    int? Ac,
    int SortOrder
);
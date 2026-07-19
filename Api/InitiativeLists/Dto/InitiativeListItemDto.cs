namespace Api.InitiativeLists.Dto;

public record InitiativeListItemDto(
    string Id,
    int? Initiative,
    int? InitiativeBonus,
    string? Name,
    int? Hp,
    int? Ac,
    int SortOrder
);
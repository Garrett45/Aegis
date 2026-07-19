namespace Api.InitiativeLists.Shared;

public record InitiativeListBasicResponse(
    int Id,
    int AccountId,
    string Name,
    int Round
);
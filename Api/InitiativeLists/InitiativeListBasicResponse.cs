namespace Api.InitiativeLists;

public record InitiativeListBasicResponse(
    int Id,
    int AccountId,
    string Name,
    int Round
);
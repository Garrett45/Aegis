using Api.Shared.EntityFrameworkCore.Models;
using Bogus;

namespace Api.IntegrationTests.Shared.Faker;

public sealed class InitiativeListFaker : Faker<InitiativeList>
{
    public InitiativeListFaker(int accountId)
    {
        RuleFor(o => o.AccountId, f => accountId);
        RuleFor(o => o.Name, f => f.Hacker.Phrase());
        RuleFor(o => o.Round, f => f.Random.Int(1, 20));
    }
}
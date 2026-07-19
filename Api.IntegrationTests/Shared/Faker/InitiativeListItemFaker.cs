using Api.Shared.EntityFrameworkCore.Models;
using Bogus;

namespace Api.IntegrationTests.Shared.Faker;

public sealed class InitiativeListItemFaker : Faker<InitiativeListItem>
{
    public InitiativeListItemFaker(int initiativeListId)
    {
        RuleFor(o => o.InitiativeListId, f => initiativeListId);
        RuleFor(o => o.Initiative, f => f.Random.Int(1, 25));
        RuleFor(o => o.InitiativeBonus, f => f.Random.Int(-5, 5));
        RuleFor(o => o.Name, f => f.Lorem.Word());
        RuleFor(o => o.Hp, f => f.Random.Int(-10, 120));
        RuleFor(o => o.Ac, f => f.Random.Int(10, 25));
        RuleFor(o => o.IsActive, f =>
        {
            if (HasGeneratedActiveItem) return false;
            var isActive = f.Random.Bool(0.20f);
            if (isActive) HasGeneratedActiveItem = true;
            return isActive;
        });
        RuleFor(o => o.SortOrder, f => SortOrder++);
    }

    private int SortOrder { get; set; } = 1;
    private bool HasGeneratedActiveItem { get; set; }
}
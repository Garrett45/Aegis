using System.Security.Claims;
using Api.Shared.EntityFrameworkCore;
using Api.Shared.EntityFrameworkCore.Models;

namespace Api.Shared;

public class GetOrCreateAccount(AegisContext context)
{
    public async Task<Account> Execute(ClaimsPrincipal user)
    {
        var identityProviderId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (identityProviderId is null)
            throw new InvalidOperationException("Claims principal must include a unique ID");

        var existingAccount =
            context.Accounts.FirstOrDefault(account => account.IdentityProviderId == identityProviderId);
        if (existingAccount is not null) return existingAccount;

        var newAccount = new Account
        {
            IdentityProviderId = identityProviderId,
            FirstName = user.FindFirstValue(ClaimTypes.GivenName) ?? "",
            LastName = user.FindFirstValue(ClaimTypes.Surname) ?? ""
        };
        await context.Accounts.AddAsync(newAccount);
        await context.SaveChangesAsync();
        return newAccount;
    }
}
using System.Net;
using System.Net.Http.Json;
using Api.InitiativeLists;
using Api.IntegrationTests.Shared.Faker;
using Api.IntegrationTests.Shared.TestWebApplication;
using Api.Shared;
using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Api.IntegrationTests.InitiativeLists;

public class InitiativeListsEndpointTests
{
    [Test]
    public async Task ReadAll_EndpointReturnsUnauthorizedWithoutAuth()
    {
        var client = ApiSetUpFixture.Factory.CreateClient();
        var response = await client.GetAsync("/api/InitiativeLists");
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.Unauthorized));
    }

    [Test]
    public async Task ReadAll_EndpointSuccessfullyReturnsWithNoLists()
    {
        var client = ApiSetUpFixture.Factory.WithBasicTestUserAuthenticated().CreateClient();
        var response = await client.GetAsync("/api/InitiativeLists");
        response.EnsureSuccessStatusCode();
    }

    [Test]
    public async Task ReadAll_EndpointSuccessfullyReturnsWithOneList()
    {
        using var scope = ApiSetUpFixture.Factory.Services.CreateScope();
        var context = ApiSetUpFixture.Factory.GetDbContext(scope);

        var getOrCreateAccount = new GetOrCreateAccount(context);
        var account = await getOrCreateAccount.Execute(BasicTestUserAuthHandler.GetUser());

        var initiativeList = new InitiativeListFaker(account.Id).Generate();
        await context.InitiativeLists.AddAsync(initiativeList);
        await context.SaveChangesAsync();

        var client = ApiSetUpFixture.Factory.WithBasicTestUserAuthenticated().CreateClient();
        var response = await client.GetAsync("/api/InitiativeLists");

        response.EnsureSuccessStatusCode();
        var returnedInitiativeLists =
            (await response.Content.ReadFromJsonAsync<IEnumerable<InitiativeListBasicResponse>>())?.ToList();
        Assert.That(returnedInitiativeLists, Is.Not.Null);

        // we could enforce an order here, or just accept that we created one valid initiative list, so at least one should return
        // especially considering we have other tests, this is fine
        Assert.That(returnedInitiativeLists, Has.Count.GreaterThanOrEqualTo(1));
    }

    [Test]
    public async Task Read_EndpointSuccessfullyReturnsWithCorrectList()
    {
        using var scope = ApiSetUpFixture.Factory.Services.CreateScope();
        var context = ApiSetUpFixture.Factory.GetDbContext(scope);

        var getOrCreateAccount = new GetOrCreateAccount(context);
        var account = await getOrCreateAccount.Execute(BasicTestUserAuthHandler.GetUser());

        var initiativeList = new InitiativeListFaker(account.Id).Generate();
        await context.InitiativeLists.AddAsync(initiativeList);
        await context.SaveChangesAsync();

        var client = ApiSetUpFixture.Factory.WithBasicTestUserAuthenticated().CreateClient();
        var response = await client.GetAsync($"/api/InitiativeLists/{initiativeList.Id}");

        response.EnsureSuccessStatusCode();
        var returnedInitiativeList =
            await response.Content.ReadFromJsonAsync<InitiativeListDto>();
        Assert.That(returnedInitiativeList, Is.Not.Null);
        Assert.That(returnedInitiativeList.Id, Is.EqualTo(initiativeList.Id));
        Assert.That(returnedInitiativeList.Name, Is.EqualTo(initiativeList.Name));
        Assert.That(returnedInitiativeList.Round, Is.EqualTo(initiativeList.Round));
    }

    [Test]
    public async Task Create_EndpointSuccessfullyCreatesList()
    {
        using var scope = ApiSetUpFixture.Factory.Services.CreateScope();
        var context = ApiSetUpFixture.Factory.GetDbContext(scope);

        var client = ApiSetUpFixture.Factory.WithBasicTestUserAuthenticated().CreateClient();
        var faker = new Faker();
        var createInitiativeListRequest = new CreateInitiativeListRequest(faker.Hacker.Phrase());
        var response = await client.PostAsJsonAsync("/api/InitiativeLists", createInitiativeListRequest);

        var returnedInitiativeList =
            await response.Content.ReadFromJsonAsync<InitiativeListBasicResponse>();
        var initiativeList = await context.InitiativeLists.FindAsync(returnedInitiativeList?.Id);

        response.EnsureSuccessStatusCode();
        Assert.That(returnedInitiativeList, Is.Not.Null);
        Assert.That(initiativeList, Is.Not.Null);
        Assert.That(returnedInitiativeList.Id, Is.EqualTo(initiativeList.Id));
        Assert.That(returnedInitiativeList.Name, Is.EqualTo(initiativeList.Name));
        Assert.That(returnedInitiativeList.Round, Is.EqualTo(initiativeList.Round));
    }

    [Test]
    public async Task Update_EndpointSuccessfullyUpdatesList()
    {
        using var scope = ApiSetUpFixture.Factory.Services.CreateScope();
        var context = ApiSetUpFixture.Factory.GetDbContext(scope);

        var getOrCreateAccount = new GetOrCreateAccount(context);
        var account = await getOrCreateAccount.Execute(BasicTestUserAuthHandler.GetUser());

        var initiativeList = new InitiativeListFaker(account.Id).Generate();
        await context.InitiativeLists.AddAsync(initiativeList);
        await context.SaveChangesAsync();

        var client = ApiSetUpFixture.Factory.WithBasicTestUserAuthenticated().CreateClient();
        var faker = new Faker();
        var initiativeListRequest = new InitiativeListDto(
            initiativeList.Id,
            faker.Hacker.Phrase(),
            faker.Random.Number(1, 20),
            "",
            []
        );
        var response = await client.PutAsJsonAsync($"/api/InitiativeLists/{initiativeList.Id}", initiativeListRequest);

        await context.Entry(initiativeList).ReloadAsync();

        response.EnsureSuccessStatusCode();
        Assert.That(initiativeList, Is.Not.Null);
        Assert.That(initiativeListRequest.Id, Is.EqualTo(initiativeList.Id));
        Assert.That(initiativeListRequest.Name, Is.EqualTo(initiativeList.Name));
        Assert.That(initiativeListRequest.Round, Is.EqualTo(initiativeList.Round));
    }

    [Test]
    public async Task Delete_EndpointSuccessfullyRemovesList()
    {
        using var scope = ApiSetUpFixture.Factory.Services.CreateScope();
        var context = ApiSetUpFixture.Factory.GetDbContext(scope);

        var getOrCreateAccount = new GetOrCreateAccount(context);
        var account = await getOrCreateAccount.Execute(BasicTestUserAuthHandler.GetUser());

        var initiativeList = new InitiativeListFaker(account.Id).Generate();
        await context.InitiativeLists.AddAsync(initiativeList);
        await context.SaveChangesAsync();

        var client = ApiSetUpFixture.Factory.WithBasicTestUserAuthenticated().CreateClient();
        var response = await client.DeleteAsync($"/api/InitiativeLists/{initiativeList.Id}");

        context.Entry(initiativeList).State = EntityState.Detached;
        var initiativeListAfterDelete = await context.InitiativeLists.FindAsync(initiativeList.Id);

        response.EnsureSuccessStatusCode();
        Assert.That(initiativeListAfterDelete, Is.Null);
    }
}
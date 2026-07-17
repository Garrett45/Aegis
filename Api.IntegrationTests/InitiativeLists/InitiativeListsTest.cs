namespace Api.IntegrationTests.InitiativeLists;

public class InitiativeListsTest
{
    [Test]
    public async Task ReadAll_EndpointsReturnSuccess()
    {
        var client = ApiSetUpFixture.Factory.CreateClient();
        var response = await client.GetAsync("/api/InitiativeLists");
        response.EnsureSuccessStatusCode();
    }
}
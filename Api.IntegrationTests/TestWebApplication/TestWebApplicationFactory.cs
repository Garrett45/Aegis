using Api.Shared.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;

namespace Api.IntegrationTests.TestWebApplication;

public class TestWebApplicationFactory<TProgram>(string dbConnectionString)
    : WebApplicationFactory<TProgram> where TProgram : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        Environment.SetEnvironmentVariable("ConnectionStrings__AegisContext", dbConnectionString);

        builder.UseEnvironment("Development");
        builder.ConfigureTestServices(services =>
        {
            services.AddAuthentication("TestScheme")
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("TestScheme", options => { });
        });
    }

    public AegisContext GetDbContext(IServiceScope scope)
    {
        var db = scope.ServiceProvider.GetService<AegisContext>();
        if (db == null)
            Assert.Fail("DB Context is not injecting via service provider properly. Test does not work");

        return db!;
    }
}
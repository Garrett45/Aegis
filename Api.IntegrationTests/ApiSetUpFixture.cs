using Api.IntegrationTests.TestWebApplication;
using DotNet.Testcontainers.Builders;
using Microsoft.Data.SqlClient;
using Testcontainers.MsSql;

namespace Api.IntegrationTests;

// This class is reliant on namespaces (sub-namespaces can use the fixture), so it has to exist here rather than in
// shared which would better fit with how I store files. I could just make the namespace not match, but that is not
// ideal
[SetUpFixture]
public class ApiSetUpFixture
{
    private const string DbName = "aegis";
    private static MsSqlContainer MsSqlContainer { get; set; }
    public static TestWebApplicationFactory<Program> Factory { get; private set; }

    [OneTimeSetUp]
    public async Task SetUp()
    {
        MsSqlContainer = await SetupDatabase();

        var connectionString = new SqlConnectionStringBuilder(MsSqlContainer.GetConnectionString())
        {
            InitialCatalog = DbName
        };
        Factory = new TestWebApplicationFactory<Program>(connectionString.ToString());
    }

    [OneTimeTearDown]
    public async Task TearDown()
    {
        await MsSqlContainer.DisposeAsync();
        await Factory.DisposeAsync();
    }

    private async Task<MsSqlContainer> SetupDatabase()
    {
        var network = new NetworkBuilder()
            .Build();

        var dbHost = $"aegis-db-{Guid.NewGuid().ToString()}";
        const string dbRootUser = "sa";
        const string dbPassword = "Secure-Password.1234";

        var msSqlContainer = new MsSqlBuilder("mcr.microsoft.com/mssql/server:2025-latest")
            .WithName(dbHost)
            .WithPassword(dbPassword)
            .WithNetwork(network)
            .WithWaitStrategy(Wait.ForUnixContainer()
                .UntilCommandIsCompleted("/opt/mssql-tools18/bin/sqlcmd", "-C", "-Q", "SELECT 1;"))
            .Build();

        string[] dbInitParameters =
        [
            "-C",
            "-S",
            dbHost,
            "-U",
            dbRootUser,
            "-P",
            dbPassword,
            "-Q",
            $"IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = \"{DbName}\") CREATE DATABASE {DbName};"
        ];
        var dbInitContainer = new ContainerBuilder("mcr.microsoft.com/mssql/server:2025-latest")
            .WithEntrypoint("/opt/mssql-tools18/bin/sqlcmd")
            .WithCommand(dbInitParameters)
            .WithNetwork(network)
            .DependsOn(msSqlContainer)
            .Build();

        string[] flywayParameters =
        [
            $"-url=jdbc:sqlserver://{dbHost};databaseName={DbName};trustServerCertificate=true",
            $"-password={dbPassword}",
            $"-user={dbRootUser}",
            "-target=latest",
            "migrate"
        ];
        var flywayContainer = new ContainerBuilder("flyway/flyway:11")
            .WithName($"flyway-{Guid.NewGuid().ToString()}")
            .WithResourceMapping(Path.GetFullPath("Migrations"), "/flyway/sql")
            .WithEntrypoint("flyway")
            .WithCommand(flywayParameters)
            .WithNetwork(network)
            .Build();

        await msSqlContainer.StartAsync();

        await dbInitContainer.StartAsync();
        var dbInitExitCode = await dbInitContainer.GetExitCodeAsync();
        if (dbInitExitCode != 0) Assert.Fail("DB Init container failed to create initial database");

        await flywayContainer.StartAsync();
        var flywayExitCode = await flywayContainer.GetExitCodeAsync();
        if (flywayExitCode != 0) Assert.Fail("Flyway container failed to migrate database");

        await dbInitContainer.DisposeAsync();
        await flywayContainer.DisposeAsync();

        return msSqlContainer;
    }
}
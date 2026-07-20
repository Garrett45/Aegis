# Aegis API

This part of the repo includes the code written for the API of Aegis. It is a fairly standard ASP.NET Core Web API using EF Core to connect to a SQL Server DB. 

# Exporting Types from DB

EF Core, for this project, is being used in a DB-first style. This means we make changes to the DB directly via Flyway, and then we need to reflect the changes to the DB in our EF Core code. Luckily, there is a command to automatically generate the needed EF Core types. With the compose file at the root of this repository running, you simply run the following command

```shell
dotnet ef dbcontext scaffold "User ID=sa;Password=YourStrong@Password123;Initial Catalog=aegis;Server=127.0.0.1;trustServerCertificate=true" Microsoft.EntityFrameworkCore.SqlServer --output-dir Shared/EntityFrameworkCore/Models --context-dir Shared/EntityFrameworkCore --force --no-onconfiguring
```

# Building the Dockerfile

If you find yourself needing to build the Dockerfile for the API, it is important to know that the API assumes the context directory is at the root of the repository. So, to build the Dockerfile in this directory, you will want to run the following command in the repository's root directory

```shell
docker build -t aegis-api -f .\Api\Dockerfile .
```

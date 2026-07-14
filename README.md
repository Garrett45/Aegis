This is my example project I built to demonstrate to scope my software development chops. I tried to include a variety of things to show off a bit more of a fully featured project. It has the following things:

* Routing in the frontend allowing us to travel between multiple pages (there is no central router in React, so an important technical decision had to be made there to make it work)

* CRUD operations that require UI components, calls to the backend, and that backend to speak to the database

* Docker images for the UI, API, and database to run in a docker compose environment, allowing for a nice local dev environment

* Environment based configurations for the API, and UI, allowing them to connect to different DBs and to include different settings depending on the environment

* Secret support for local development

This project is somewhat limited due to the fact that I didn't want to provision real resources on the cloud, as that would cost money. Some of the things that hit the cutting room floor because of it are as follows:

* Auth - that requires a 

# Building Docker FIles

Building API

```bash
docker build -t scope-crud-example-api -f .\api\Dockerfile .
```

Build UI

```bash

```

Compose for containers of SQL Server, ASP.NET Core backend, React frontend. Basic CRUD app functionality. Add in testing for backend in the form of unit testing (show a situation where it makes sense) and integration testing (maybe using test containers)

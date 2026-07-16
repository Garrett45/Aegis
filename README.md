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

# Getting Types From DB

```
dotnet ef dbcontext scaffold "User ID=sa;Password=YourStrong@Password123;Initial Catalog=aegis;Server=127.0.0.1;trustServerCertificate=true" Microsoft.EntityFrameworkCore.SqlServer --output-dir Shared/EntityFrameworkCore/Models --context-dir Shared/EntityFrameworkCore --force --no-onconfiguring
```

# URL Weirdness

Since we are running these things from containers, we sometimes have to use URLs that don't look quite right. The authority for the API, for example, uses "http://host.docker.internal:8000/realms/athena", because thats whats required to connect to the keycloak docker container on the system. However, valid issuer, in that same configuration, which represents the same thing, is set to "http://localhost:8000/realms/athena", because that is what the frontend requests to

# Inspiration

Based on this initiative tracker: [Initiative Tracker | DM Tools](https://dm.tools/tracker)

* Keeping
  
  * Sort being something you do after the fact (no sudden layout shifts, allows personalized ordering)
  
  * Drag and Drop Ordering (personalized ordering in the case of passing turns or same initiatives)
  
  * Highlighted current turn, next turn and round counters
  
  * Autocomplete of names, but still allowing whatever name you want
  
  * Initiative being something you roll by clicking and inputs being allowed (allows you to enter player inputs but automatically roll monster inputs)
  
  * Text based HP - no minus plus system makes it faster, and allowing it to be empty means players can track their own and you don't have to put it in
  
  * AC tracker - like having right there so I don't have to ask
  
  * Delete button. I like the idea of removing monsters as they die
  
  * Client side evaluation immediately, so things are fast and smooth
  
  * General design/look. It looks approachable and nice

* Modifications
  
  * Hitting plus button adds row and moves it down. Fix plus button in place to make it easier to add many
  
  * Have initiative tracker saved to central DB so that you can pick up initiatives later and on different devices (the initiative tracker says it has one, but I don't think you can do that yet)
  
  * Have presets so you can make new initiatives for a party you have a campaign with faster
  
  * Remove clear button, will not be needed in my design
  
  * Remove round reset button, that is almost never needed
  
  * Add modal when hitting delete - if you misclick, don't want that valuable information lost when that is supposed to be fast and easy. Killing something in combat is usually a spectacle, so the interaction cost is okay
  
  * Add a "previous" button, so that you can go back when stuff needs to be redone. Just nice to have the right round on the count and the right thing highlighted if you have to go back
  
  * Have a "roll all empty" button, so you can simply click one button to roll the initiative for all the monsters
  
  * Better styling on tablets/phone. Main support is down to tablet, as phone is usually used for something like music, but I want styling to work on a phone at the least. Tablet support should be considered a priority though
  
  * Keep next, previous, and add button (three most important) in a bottom tray that 
  
  * Fix how dragging an initiative keeps it under the rest
  
  * Fix that deleting the active initiative breaks the initiative tracker. If we do delete the active, it should go to the next combatant, as killing something moves you forward in the turn order
  
  * Initiative bonus should be modifiable outside of autocomplete creatures for custom creatures and players

Originally, was going to have presets. Then, I realized having two separate tables that represent the same thing results in a lot of duplication, and that I wasn't really going to use the flexibility provided by having those separate tables. Then, I thought of putting a flag on initiative lists to mark some as presets, but I realized there was duplication there, too. Finally, I realized if I was not going to make anything special with the presets, I ought to just have a duplication feature

# Technical Decisions

* React
  
  * Pros
    
    * I know it, short time crunch
    
    * I know it could support all the things I'm trying to do
  
  * Trade offs
    
    * Greater client side power required - fine because we are assuming stronger computers for people running this (iPads, Laptops, Desktops, personal devices)

* API added between FE and database
  
  * Pros
    
    * Makes resource control with auth possible
    
    * Allows more normal OIDC auth systems, federated logins. This will allow things like "Sign in with Google". Important for a little, throw away app like this that needs a login
    
    * Adds flexibility with how data from the database is presented
    
    * Does not require provisioning access on DB for individual frontend users
  
  * Trade offs
    
    * Greater network time when making requests (has to go to API first)
    
    * More development time, as we have to deal with the extra piece
    
    * Can't track what individual users did in DB based on login, have to make sure API does

* ASP.NET Core
  
  * Pros    
    
    * I know it, short time crunch
    
    * I know it could support all the things I'm trying to do
  
  * Trade offs
    
    * Slightly more power required on backend to run it compared to something mroe low level

* Client side evaluation
  
  * Pros
    
    * FAST. Very nice UX
    
    * Less power required on server side. Server just has to take things after all evaluations have happened, verify it works, and save it
  
  * Trade offs
    
    * More power required on client side
    
    * Complicated case to deal with when syncing to backend
    
    * Thorny issue with generating IDs (have to be generated on the frontend, but eventually the database should generate them to guarantee unique-ness)

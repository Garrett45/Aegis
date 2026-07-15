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

# Aegis

This is Aegis - an initiative tracker to be used with D&D and TTRPGs with similar initiative systems to D&D. It is based on the [lovely initiative tracker over at DM tools](https://dm.tools/tracker) and keeps a lot of the things from that tracker I like, but it comes with the following improvements:

* Buttons are placed so they don't move when the table gets bigger (mainly important for the "plus" button, makes it easier to add many items)

* Allows saving initiatives

* Allows creating new initiative lists based off of already existing ones

* Removes round reset so you don't accidentally lose that valuable info

* Removes the clear button so you don't lose valuable info

* Adds a previous turn button to allow for backtracking

* Is styled and designed in such a way to work tablets/phones

* Adds a nice button that allows you to roll all empty initiatives, so you don't need to individually click each initiative

* Makes roll button always visible to work on tablets/phones, and to make it easier to hit

* Makes initiative bonuses modifiable directly, so you can roll for creatures that exist outside of D&D Beyond

* Fixes a bug where deleting the active initiative list item breaks the active initiative

* Fixes a bug where dragging an initiative list item has it go under other items

# Running the Application

To run the application locally, you will need to clone another repo with the auth system. That can be found [here](https://github.com/Garrett45/AthenaAuth). Once that is cloned and running, this repo provides its own compose script to run the application. Simply run the following command in the root directory of the repo to run the application and enable file watches for hot refreshing the app where possible

```shell
docker compose up --build --watch
```

The location of the frontend, backend, and DB on your system will be as follows:

* Frontend: http://localhost:5173

* Backend: http://localhost:8080

* DB: http://localhost:1433

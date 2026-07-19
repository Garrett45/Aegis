import { index, prefix, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home/home-route.tsx"),

  ...prefix("initiative-lists", [
    route("add", "routes/initiative-lists/add/add-initiative-list-route.tsx"),
    route(
      "duplicate",
      "routes/initiative-lists/duplicate/duplicate-initiative-list-route.tsx",
    ),
    route(
      ":initiativeListId",
      "routes/initiative-lists/edit/edit-initiative-list-route.tsx",
    ),
  ]),
] satisfies RouteConfig;

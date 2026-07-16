import {
  index,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),

  ...prefix("initiative-lists", [
    route("add", "routes/initiative-lists/add/add-initiative-list.tsx"),
    route(
      ":initiativeListId",
      "routes/initiative-lists/edit/edit-initiative-list.tsx",
    ),
  ]),
] satisfies RouteConfig;

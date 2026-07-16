import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route(
    "initiative-lists/:initiativeListId",
    "routes/initiative-lists/initiative-list.tsx",
  ),
] satisfies RouteConfig;

import type { Route } from "../../../.react-router/types/app/routes/home/+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    {
      name: "description",
      content: "This is the home page of all the DM tools under Athena",
    },
  ];
}

export default function Home() {
  return (
    <main>
      <div>HOME</div>
    </main>
  );
}

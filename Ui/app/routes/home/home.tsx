import type { Route } from "../../../.react-router/types/app/routes/home/+types/home";
import Row from "~/shared/table/rows/row";
import HeadCell from "~/shared/table/cells/head-cell";
import DeleteCell from "~/shared/table/cells/delete-cell";
import Table from "~/shared/table/table";
import Cell from "~/shared/table/cells/cell";
import LinkCell from "~/shared/table/cells/link-cell";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    {
      name: "description",
      content: "This is the home page of all the DM tools under Athena",
    },
  ];
}

interface InitiativeListBasicResponse {
  id: number;
  accountId: number;
  name: string;
  round: number;
}

export async function loader({ params }: Route.LoaderArgs) {
  const initiativeListResponse = await fetch(
    `http://api:8080/api/InitiativeLists`,
  );
  return (await initiativeListResponse.json()) as InitiativeListBasicResponse[];
}

export default function Home({
  loaderData: initiativeLists,
}: Route.ComponentProps) {
  const deleteInitiativeList = async (id: number) => {
    await fetch(`http://localhost:8080/api/InitiativeLists/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <main>
      <header className="flex flex-col items-center gap-9"></header>
      <div className={"max-w-300 mx-auto"}>
        <h1 className={"text-2xl mt-4 mb-2"}>Encounters</h1>
        <Table gridColStyle={`grid-cols-[3fr_1fr_50px]`}>
          <Row>
            <HeadCell>Name</HeadCell>
            <HeadCell>Round</HeadCell>
            <HeadCell />
          </Row>
          {initiativeLists.map((initiativeList) => (
            <Row>
              <LinkCell to={`/initiative-lists/${initiativeList.id}`}>
                {initiativeList.name}
              </LinkCell>
              <Cell>{initiativeList.round}</Cell>
              <DeleteCell
                onClick={() =>
                  deleteInitiativeList(initiativeList.id).catch((error) =>
                    console.error(error),
                  )
                }
              />
            </Row>
          ))}
        </Table>
      </div>
    </main>
  );
}

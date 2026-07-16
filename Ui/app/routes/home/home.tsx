import type { Route } from "../../../.react-router/types/app/routes/home/+types/home";
import Row from "~/shared/components/table/rows/row";
import HeadCell from "~/shared/components/table/cells/head-cell";
import DeleteCell from "~/shared/components/table/cells/delete-cell";
import Table from "~/shared/components/table/table";
import Cell from "~/shared/components/table/cells/cell";
import LinkCell from "~/shared/components/table/cells/link-cell";
import {
  buttonSharedStyles,
  normalButtonColor,
} from "~/shared/components/button/styles";
import { Link } from "react-router";
import type { InitiativeListBasicResponse } from "~/shared/api/initiative-lists";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    {
      name: "description",
      content: "This is the home page of all the DM tools under Athena",
    },
  ];
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
      <div className={"max-w-300 mx-auto"}>
        <div className={"mt-4 mb-2 flex items-center"}>
          <h1 className={"text-2xl"}>Initiative Lists</h1>
          <div className={"flex items-center ml-auto gap-2"}>
            <Link
              className={`${buttonSharedStyles} ${normalButtonColor}`}
              to={"/initiative-lists/add"}
            >
              Add
            </Link>
          </div>
        </div>

        <Table gridColStyle={`grid-cols-[3fr_1fr_50px]`}>
          <Row>
            <HeadCell>Name</HeadCell>
            <HeadCell>Round</HeadCell>
            <HeadCell />
          </Row>
          {initiativeLists.map((initiativeList) => (
            <Row key={initiativeList.id}>
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

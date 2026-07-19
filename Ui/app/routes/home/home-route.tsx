import type { Route } from "../../../.react-router/types/app/routes/home/+types/home-route";
import Row from "~/shared/components/table/rows/row";
import HeadCell from "~/shared/components/table/cells/head-cell";
import DeleteCell from "~/shared/components/table/cells/delete-cell";
import Table from "~/shared/components/table/table";
import Cell from "~/shared/components/table/cells/cell";
import LinkCell from "~/shared/components/table/cells/link-cell";
import { buttonSharedStyles, normalButtonColor } from "~/shared/components/button/styles";
import { Link } from "react-router";
import { useAuth } from "react-oidc-context";
import { appWidth } from "~/shared/components/layout/styles";
import { useAllInitiativeLists, useDeleteInitiativeList } from "~/shared/api/initiative-lists";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aegis" },
    {
      name: "description",
      content:
        "This is the home page of the initiative tracker Aegis. Here, you can view all your initiative lists",
    },
  ];
}

export default function HomeRoute() {
  const auth = useAuth();
  const { data: initiativeLists } = useAllInitiativeLists();
  const { mutate: deleteInitiativeList } = useDeleteInitiativeList();

  return (
    <main>
      <div className={`${appWidth} mx-auto`}>
        {auth.isAuthenticated ? (
          <>
            <div className={"mt-4 mb-2 flex items-center flex-wrap"}>
              <h1 className={"text-2xl"}>Initiative Lists</h1>
              <div className={"flex items-center ml-auto gap-2"}>
                <Link
                  className={`${buttonSharedStyles} ${normalButtonColor}`}
                  to={"/initiative-lists/add"}
                >
                  Add
                </Link>
                <Link
                  className={`${buttonSharedStyles} ${normalButtonColor}`}
                  to={"/initiative-lists/duplicate"}
                >
                  Duplicate Existing
                </Link>
              </div>
            </div>

            <Table gridColStyle={`grid-cols-[3fr_1fr_50px]`}>
              <Row>
                <HeadCell>Name</HeadCell>
                <HeadCell>Round</HeadCell>
                <HeadCell />
              </Row>
              {initiativeLists?.map?.((initiativeList) => (
                <Row key={initiativeList.id}>
                  <LinkCell to={`/initiative-lists/${initiativeList.id}`}>
                    {initiativeList.name}
                  </LinkCell>
                  <Cell>{initiativeList.round}</Cell>
                  <DeleteCell
                    onClick={() => deleteInitiativeList(initiativeList.id)}
                  />
                </Row>
              ))}
            </Table>
          </>
        ) : (
          <div>
            You are not authenticated! To be able to see this page, you will
            either need to log in or sign up
          </div>
        )}
      </div>
    </main>
  );
}

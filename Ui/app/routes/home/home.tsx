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
import {
  allInitiativeListsQueryKey,
  type InitiativeListBasicResponse,
} from "~/shared/api/initiative-lists";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { appWidth } from "~/shared/components/layout/styles";

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
  const auth = useAuth();

  const queryClient = useQueryClient();
  const { data: initiativeLists } = useQuery({
    queryKey: allInitiativeListsQueryKey(auth),
    queryFn: async () => {
      const initiativeListResponse = await fetch(
        `http://localhost:8080/api/InitiativeLists`,
        {
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
          },
        },
      );
      return (await initiativeListResponse.json()) as InitiativeListBasicResponse[];
    },
    enabled: auth.isAuthenticated,
  });

  const { mutate: deleteInitiativeList } = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`http://localhost:8080/api/InitiativeLists/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      });
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: allInitiativeListsQueryKey(auth),
      });
    },
  });

  return (
    <main>
      <div className={`${appWidth} mx-auto`}>
        {auth.isAuthenticated ? (
          <>
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

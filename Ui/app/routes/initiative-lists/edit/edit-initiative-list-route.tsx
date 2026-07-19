import React, { useState } from "react";
import type {
  Route
} from "../../../../.react-router/types/app/routes/initiative-lists/edit/+types/edit-initiative-list-route";
import { type InitiativeListDto, type InitiativeListItemDto, useInitiativeList } from "~/shared/api/initiative-lists";
import { appWidth } from "~/shared/components/layout/styles";
import EditInitiativeListFooter from "~/routes/initiative-lists/edit/edit-initiative-list-footer";
import InitiativeListTable from "~/routes/initiative-lists/edit/initiative-list-table/initiative-list-table";
import InitiativeListTableActionRow
  from "~/routes/initiative-lists/edit/initiative-list-table/initiative-list-table-action-row";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Initiative List" },
    {
      name: "description",
      content:
        "This page is where you track your initiative. Any changes you make to the initiative list can be saved for later use",
    },
  ];
}

export default function EditInitiativeListRoute({
  params,
}: Route.ComponentProps) {
  const { data: initiativeList, isFetchedAfterMount } = useInitiativeList(
    params.initiativeListId,
  );

  if (typeof initiativeList === "undefined" || !isFetchedAfterMount)
    return undefined;
  return <InternalInitiativeList initiativeList={initiativeList} />;
}

interface InternalInitiativeListProps {
  initiativeList: InitiativeListDto;
}

const InternalInitiativeList = ({
  initiativeList,
}: InternalInitiativeListProps) => {
  const [initiativeListItems, setInitiativeListItems] = useState<
    InitiativeListItemDto[]
  >(initiativeList.initiativeListItems);
  const [
    activeInitiativeListItemPosition,
    setActiveInitiativeListItemPosition,
  ] = useState({
    activeId: initiativeList.activeId,
    round: initiativeList.round,
  });
  const [name, setName] = useState(initiativeList.name);

  return (
    <>
      <main className={"mb-8"}>
        <div className={`${appWidth} mx-auto`}>
          <h1 className={"text-2xl mt-4 mb-2"}>
            Encounter:{" "}
            <input
              className={"max-w-full"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </h1>
          <InitiativeListTableActionRow
            initiativeList={initiativeList}
            initiativeListItems={initiativeListItems}
            setInitiativeListItems={setInitiativeListItems}
            activeInitiativeListItemPosition={activeInitiativeListItemPosition}
            name={name}
          />
          <InitiativeListTable
            initiativeListItems={initiativeListItems}
            setInitiativeListItems={setInitiativeListItems}
            activeInitiativeListItemPosition={activeInitiativeListItemPosition}
            setActiveInitiativeListItemPosition={
              setActiveInitiativeListItemPosition
            }
          />
        </div>
      </main>
      <EditInitiativeListFooter
        initiativeListItems={initiativeListItems}
        setInitiativeListItems={setInitiativeListItems}
        setActiveInitiativeListItemPosition={
          setActiveInitiativeListItemPosition
        }
      />
    </>
  );
};

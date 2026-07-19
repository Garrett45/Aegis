import { useState } from "react";
import {
  buttonSharedStyles,
  normalButtonColor,
} from "~/shared/components/button/styles";
import type { Route } from "../../../../.react-router/types/app/routes/initiative-lists/edit/+types/edit-initiative-list";
import {
  type InitiativeListDto,
  type InitiativeListItemDto,
  useInitiativeList,
  useUpdateInitiativeList,
} from "~/shared/api/initiative-lists";
import { appWidth } from "~/shared/components/layout/styles";
import InitiativeListFooter from "~/routes/initiative-lists/edit/initiative-list-footer";
import InitiativeListTable from "~/routes/initiative-lists/edit/initiative-list-table/initiative-list-table";
import SortButton from "~/routes/initiative-lists/edit/sort-button";
import RollAllEmptyButton from "~/routes/initiative-lists/edit/roll-all-empty-button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Initiative List" },
    {
      name: "description",
      content: "This is a page to modify an initiative list",
    },
  ];
}

export default function EditInitiativeList({ params }: Route.ComponentProps) {
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
  const { mutate: save, isPending: isSavePending } = useUpdateInitiativeList();

  return (
    <>
      <main className={"mb-8"}>
        <div className={`${appWidth} mx-auto`}>
          <h1 className={"text-2xl mt-4 mb-2"}>
            Encounter:{" "}
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </h1>
          <div className={"mb-2 flex items-center"}>
            <h1 className={"text-2xl"}>
              Round {activeInitiativeListItemPosition.round}
            </h1>
            <div className={"flex items-center ml-auto gap-2"}>
              <RollAllEmptyButton
                setInitiativeListItems={setInitiativeListItems}
              />
              <SortButton setInitiativeListItems={setInitiativeListItems} />
              <button
                className={`${buttonSharedStyles} ${normalButtonColor}`}
                onClick={() =>
                  save({
                    id: initiativeList.id,
                    accountId: initiativeList.accountId,
                    name,
                    round: activeInitiativeListItemPosition.round,
                    activeId: activeInitiativeListItemPosition.activeId,
                    initiativeListItems: initiativeListItems,
                  })
                }
                disabled={isSavePending}
              >
                Save
              </button>
            </div>
          </div>
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
      <InitiativeListFooter
        initiativeListItems={initiativeListItems}
        setInitiativeListItems={setInitiativeListItems}
        setActiveInitiativeListItemPosition={
          setActiveInitiativeListItemPosition
        }
      />
    </>
  );
};

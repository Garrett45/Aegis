import { useState } from "react";
import { buttonSharedStyles, normalButtonColor } from "~/shared/components/button/styles";
import type {
  Route
} from "../../../../.react-router/types/app/routes/initiative-lists/edit/+types/edit-initiative-list";
import {
  type InitiativeListDto,
  type InitiativeListItemDto,
  useInitiativeList,
  useUpdateInitiativeList
} from "~/shared/api/initiative-lists";
import { appWidth } from "~/shared/components/layout/styles";
import InitiativeListFooter from "~/routes/initiative-lists/edit/initiative-list-footer";
import InitiativeListTable from "~/routes/initiative-lists/edit/initiative-list-table";
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
  const [activeId, setActiveId] = useState(initiativeList.activeId);
  const [round, setRound] = useState(initiativeList.round);
  const [name, setName] = useState(initiativeList.name);

  const { mutate: save, isPending: isSavePending } = useUpdateInitiativeList();

  const activeIndex = initiativeListItems.findIndex(
    (initiativeListItem) => initiativeListItem.id === activeId,
  );

  const setPrevItemActive = () => {
    // if out of range, put the active index at 0
    if (activeIndex < 0 || activeIndex >= initiativeListItems.length)
      setActiveId(initiativeListItems[0].id);

    // if at the first element and its after the first round, go the previous round
    else if (activeIndex == 0 && round > 1) {
      const activeItem = initiativeListItems[initiativeListItems.length - 1];
      setActiveId(activeItem.id);
      setRound((prevState) => prevState - 1);
    }

    // if the index is not 0, move it back one
    else if (activeIndex > 0) {
      const activeItem = initiativeListItems[activeIndex - 1];
      setActiveId(activeItem.id);
    }

    // if we reach here, the active index is 0, but the round is 1, do nothing
  };

  const setNextItemActive = () => {
    // if out of range, put the active index at 0
    if (activeIndex < 0 || activeIndex >= initiativeListItems.length)
      setActiveId(initiativeListItems[0].id);

    // if at the last element, move back to the first and go to the next round
    else if (activeIndex >= initiativeListItems.length - 1) {
      const activeItem = initiativeListItems[0];
      setActiveId(activeItem.id);
      setRound((prevState) => prevState + 1);
    }

    // if we reach here, it is within range, and not the last element, so just
    // move forward
    else {
      const activeItem = initiativeListItems[activeIndex + 1];
      setActiveId(activeItem.id);
    }
  };

  return (
    <>
      <main className={"mb-8"}>
        <div className={`${appWidth} mx-auto`}>
          <h1 className={"text-2xl mt-4 mb-2"}>
            Encounter:{" "}
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </h1>
          <div className={"mb-2 flex items-center"}>
            <h1 className={"text-2xl"}>Round {round}</h1>
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
                    round,
                    activeId,
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
            setNextItemActive={setNextItemActive}
            initiativeListItems={initiativeListItems}
            setInitiativeListItems={setInitiativeListItems}
            activeId={activeId}
          />
        </div>
      </main>
      <InitiativeListFooter
        setPrevItemActive={setPrevItemActive}
        setNextItemActive={setNextItemActive}
        initiativeListItems={initiativeListItems}
        setInitiativeListItems={setInitiativeListItems}
      />
    </>
  );
};

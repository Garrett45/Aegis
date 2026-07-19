import {
  type InitiativeListDto,
  type InitiativeListItemDto,
  useUpdateInitiativeList
} from "~/shared/api/initiative-lists";
import {
  type InitiativeListItems,
  rollAllEmptyInitiativeListItems,
  sortInitiativeListItems
} from "~/routes/initiative-lists/edit/initiative-list-items/initiative-list-items";
import React, { type SetStateAction } from "react";
import MainButton from "~/shared/components/button/main-button";

interface InitiativeListTableHeaderProps {
  initiativeList: InitiativeListDto;
  initiativeListItems: InitiativeListItemDto[];
  setInitiativeListItems: React.Dispatch<
    SetStateAction<InitiativeListItemDto[]>
  >;
  activeInitiativeListItemPosition: InitiativeListItems;
  name: string;
}

export default function InitiativeListTableActionRow({
  initiativeList,
  initiativeListItems,
  setInitiativeListItems,
  activeInitiativeListItemPosition,
  name,
}: InitiativeListTableHeaderProps) {
  const { mutate: save, isPending: isSavePending } = useUpdateInitiativeList();

  return (
    <div className={"mb-2 flex items-center"}>
      <h1 className={"text-2xl"}>
        Round {activeInitiativeListItemPosition.round}
      </h1>
      <div className={"flex items-center ml-auto gap-2"}>
        <MainButton
          onClick={() =>
            setInitiativeListItems((prevState) =>
              rollAllEmptyInitiativeListItems(prevState),
            )
          }
        >
          Roll All Empty
        </MainButton>
        <MainButton
          onClick={() =>
            setInitiativeListItems((prevState) =>
              sortInitiativeListItems(prevState),
            )
          }
        >
          Sort
        </MainButton>
        <MainButton
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
        </MainButton>
      </div>
    </div>
  );
}

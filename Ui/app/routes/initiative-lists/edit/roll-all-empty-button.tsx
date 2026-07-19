import { roll } from "~/shared/services/random";
import React, { type SetStateAction } from "react";
import type { InitiativeListItemDto } from "~/shared/api/initiative-lists";
import MainButton from "~/shared/components/button/main-button";

interface RollAllEmptyButtonProps {
  setInitiativeListItems: React.Dispatch<
    SetStateAction<InitiativeListItemDto[]>
  >;
}

export default function RollAllEmptyButton({
  setInitiativeListItems,
}: RollAllEmptyButtonProps) {
  const rollAllEmpty = () => {
    setInitiativeListItems((prevState) =>
      prevState.map((initiativeListItem) => ({
        ...initiativeListItem,
        initiative:
          initiativeListItem.initiative == null
            ? roll() + (initiativeListItem.initiativeBonus ?? 0)
            : initiativeListItem.initiative,
      })),
    );
  };

  return <MainButton onClick={rollAllEmpty}>Roll All Empty</MainButton>;
}

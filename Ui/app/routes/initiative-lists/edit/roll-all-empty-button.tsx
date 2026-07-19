import {
  buttonSharedStyles,
  normalButtonColor,
} from "~/shared/components/button/styles";
import { roll } from "~/shared/services/random";
import React, { type SetStateAction } from "react";
import type { InitiativeListItemDto } from "~/shared/api/initiative-lists";

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

  return (
    <button
      className={`${buttonSharedStyles} ${normalButtonColor}`}
      onClick={rollAllEmpty}
    >
      Roll All Empty
    </button>
  );
}

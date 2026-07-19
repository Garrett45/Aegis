import {
  buttonSharedStyles,
  normalButtonColor,
} from "~/shared/components/button/styles";
import React, { type SetStateAction } from "react";
import type { InitiativeListItemDto } from "~/shared/api/initiative-lists";
import { sortInitiativeListItems } from "~/routes/initiative-lists/edit/initiative-list-items/initiative-list-items";

interface SortButtonProps {
  setInitiativeListItems: React.Dispatch<
    SetStateAction<InitiativeListItemDto[]>
  >;
}

export default function SortButton({
  setInitiativeListItems,
}: SortButtonProps) {
  const sort = () => {
    setInitiativeListItems((prevState) => sortInitiativeListItems(prevState));
  };

  return (
    <button
      className={`${buttonSharedStyles} ${normalButtonColor}`}
      onClick={sort}
    >
      Sort
    </button>
  );
}

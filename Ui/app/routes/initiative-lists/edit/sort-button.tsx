import {
  buttonSharedStyles,
  normalButtonColor,
} from "~/shared/components/button/styles";
import React, { type SetStateAction } from "react";
import type { InitiativeListItemDto } from "~/shared/api/initiative-lists";

interface SortButtonProps {
  setInitiativeListItems: React.Dispatch<
    SetStateAction<InitiativeListItemDto[]>
  >;
}

export default function SortButton({
  setInitiativeListItems,
}: SortButtonProps) {
  const sort = () => {
    setInitiativeListItems((prevState) => {
      const newState = [...prevState];
      newState.sort((a, b) => {
        const sortValue = (b.initiative ?? 0) - (a.initiative ?? 0);
        if (sortValue !== 0) return sortValue;
        return (a.name ?? "").localeCompare(b.name ?? "");
      });
      return newState.map((initiativeListItem, index) => ({
        ...initiativeListItem,
        sortOrder: index + 1,
      }));
    });
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

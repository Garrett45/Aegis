import {
  buttonSharedStyles,
  normalButtonColor,
} from "~/shared/components/button/styles";
import { FaPlus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import type { InitiativeListItemDto } from "~/shared/api/initiative-lists";
import React, { type SetStateAction } from "react";

interface InitiativeListFooterProps {
  setPrevItemActive: () => void;
  setNextItemActive: () => void;
  initiativeListItems: InitiativeListItemDto[];
  setInitiativeListItems: React.Dispatch<
    SetStateAction<InitiativeListItemDto[]>
  >;
}

export default function InitiativeListFooter({
  setPrevItemActive,
  setNextItemActive,
  initiativeListItems,
  setInitiativeListItems,
}: InitiativeListFooterProps) {
  const createEmptyInitiativeListItem = () => ({
    id: uuidv4(),
    initiative: null,
    initiativeBonus: null,
    name: null,
    hp: null,
    ac: null,
    sortOrder: initiativeListItems.length + 1,
  });

  return (
    <footer
      className={
        "sticky bottom-0 left-0 right-0 bg-white border-t-2 border-[#ddd] py-8 mt-auto"
      }
    >
      <div
        className={"max-w-300 mx-auto flex items-stretch justify-center gap-6"}
      >
        <button
          onClick={setPrevItemActive}
          className={`${buttonSharedStyles} ${normalButtonColor}`}
        >
          Prev
        </button>
        <button
          onClick={() =>
            setInitiativeListItems((prevState) => [
              ...prevState,
              createEmptyInitiativeListItem(),
            ])
          }
          className={`${buttonSharedStyles} bg-[#86E265] hover:bg-[#6BDB43]`}
        >
          <FaPlus />
        </button>
        <button
          onClick={setNextItemActive}
          className={`${buttonSharedStyles} ${normalButtonColor}`}
        >
          Next
        </button>
      </div>
    </footer>
  );
}

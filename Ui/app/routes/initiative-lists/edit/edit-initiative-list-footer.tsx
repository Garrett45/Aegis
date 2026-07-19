import { buttonSharedStyles } from "~/shared/components/button/styles";
import { FaPlus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import type { InitiativeListItemDto } from "~/shared/api/initiative-lists";
import React, { type SetStateAction } from "react";
import {
  findNextActiveInitiativeListItemPosition,
  findPrevActiveInitiativeListItemPosition,
  type InitiativeListItems,
} from "~/routes/initiative-lists/edit/initiative-list-items/initiative-list-items";
import MainButton from "~/shared/components/button/main-button";

interface InitiativeListFooterProps {
  initiativeListItems: InitiativeListItemDto[];
  setInitiativeListItems: React.Dispatch<
    SetStateAction<InitiativeListItemDto[]>
  >;
  setActiveInitiativeListItemPosition: React.Dispatch<
    SetStateAction<InitiativeListItems>
  >;
}

export default function EditInitiativeListFooter({
  initiativeListItems,
  setInitiativeListItems,
  setActiveInitiativeListItemPosition,
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
        <MainButton
          onClick={() =>
            setActiveInitiativeListItemPosition((prevState) =>
              findPrevActiveInitiativeListItemPosition(
                initiativeListItems,
                prevState,
              ),
            )
          }
        >
          Prev
        </MainButton>
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
        <MainButton
          onClick={() =>
            setActiveInitiativeListItemPosition((prevState) =>
              findNextActiveInitiativeListItemPosition(
                initiativeListItems,
                prevState,
              ),
            )
          }
        >
          Next
        </MainButton>
      </div>
    </footer>
  );
}

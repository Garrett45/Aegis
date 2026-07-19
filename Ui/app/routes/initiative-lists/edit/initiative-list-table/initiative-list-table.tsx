import Table from "~/shared/components/table/table";
import Row from "~/shared/components/table/rows/row";
import HeadCell from "~/shared/components/table/cells/head-cell";
import { DragDropProvider } from "@dnd-kit/react";
import DraggableRow from "~/shared/components/table/rows/draggable-row";
import { move } from "@dnd-kit/helpers";
import InitiativeInputCell from "~/routes/initiative-lists/edit/initiative-list-table/initiative-input-cell";
import InputCell from "~/shared/components/table/cells/input-cell";
import DeleteCell from "~/shared/components/table/cells/delete-cell";
import { toast } from "react-toastify";
import { parseNumberValue } from "~/shared/services/parsers";
import type { InitiativeListItemDto } from "~/shared/api/initiative-lists";
import React, { type SetStateAction } from "react";
import {
  findNextActiveInitiativeListItemPosition,
  type InitiativeListItems
} from "~/routes/initiative-lists/edit/initiative-list-items/initiative-list-items";

interface InitiativeListTableProps {
  initiativeListItems: InitiativeListItemDto[];
  setInitiativeListItems: React.Dispatch<
    SetStateAction<InitiativeListItemDto[]>
  >;
  activeInitiativeListItemPosition: InitiativeListItems;
  setActiveInitiativeListItemPosition: React.Dispatch<
    SetStateAction<InitiativeListItems>
  >;
}

const tableGridColStyle = `grid-cols-[50px_1fr_3fr_1fr_1fr_50px] max-sm:grid-cols-[50px_1fr_2fr_1fr_1fr_50px]`;

export default function InitiativeListTable({
  initiativeListItems,
  setInitiativeListItems,
  activeInitiativeListItemPosition,
  setActiveInitiativeListItemPosition,
}: InitiativeListTableProps) {
  const changeInitiativeListItemValue = (
    index: number,
    value: Partial<InitiativeListItemDto>,
  ) =>
    setInitiativeListItems((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1, {
        ...prevState[index],
        ...value,
      });
      return newState;
    });

  return (
    <Table gridColStyle={tableGridColStyle} minWidthStyle={"min-w-190"}>
      <Row>
        <HeadCell />
        <HeadCell>Initiative</HeadCell>
        <HeadCell>Name</HeadCell>
        <HeadCell>HP</HeadCell>
        <HeadCell>AC</HeadCell>
        <HeadCell />
      </Row>
      <DragDropProvider
        onDragEnd={(event) => {
          setInitiativeListItems((prevState) =>
            move(prevState, event).map((initiativeListItem, index) => ({
              ...initiativeListItem,
              sortOrder: index + 1,
            })),
          );
        }}
      >
        {initiativeListItems.map((initiativeListItem, index) => (
          <DraggableRow
            gridColStyle={tableGridColStyle}
            index={index}
            id={initiativeListItem.id}
            key={initiativeListItem.id}
          >
            <InitiativeInputCell
              index={index}
              active={
                initiativeListItem.id ===
                activeInitiativeListItemPosition.activeId
              }
              initiativeListItem={initiativeListItem}
              changeInitiativeListItemValue={changeInitiativeListItemValue}
            />
            <InputCell
              active={
                initiativeListItem.id ===
                activeInitiativeListItemPosition.activeId
              }
              value={initiativeListItem.name ?? ""}
              onChange={(e) =>
                changeInitiativeListItemValue(index, {
                  name: e.target.value == "" ? null : e.target.value,
                })
              }
            />
            <InputCell
              active={
                initiativeListItem.id ===
                activeInitiativeListItemPosition.activeId
              }
              value={initiativeListItem.hp ?? ""}
              onChange={(e) =>
                changeInitiativeListItemValue(index, {
                  hp: parseNumberValue(e.target.value, initiativeListItem.hp),
                })
              }
            />
            <InputCell
              active={
                initiativeListItem.id ===
                activeInitiativeListItemPosition.activeId
              }
              value={initiativeListItem.ac ?? ""}
              onChange={(e) =>
                changeInitiativeListItemValue(index, {
                  ac: parseNumberValue(e.target.value, initiativeListItem.ac),
                })
              }
            />
            <DeleteCell
              onClick={() => {
                if (initiativeListItems.length === 1) {
                  toast.error("Can not remove last element in a list");
                  return;
                }

                setInitiativeListItems((prevState) => {
                  const newState = [...prevState];
                  newState.splice(index, 1);
                  return newState;
                });
                if (
                  initiativeListItem.id ===
                  activeInitiativeListItemPosition.activeId
                )
                  setActiveInitiativeListItemPosition((prevState) =>
                    findNextActiveInitiativeListItemPosition(
                      initiativeListItems,
                      prevState,
                    ),
                  );
              }}
            />
          </DraggableRow>
        ))}
      </DragDropProvider>
    </Table>
  );
}

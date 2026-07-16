import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import InitiativeInputCell from "~/routes/initiative-lists/edit/initiative-input-cell";
import DeleteCell from "~/shared/table/cells/delete-cell";
import HeadCell from "~/shared/table/cells/head-cell";
import InputCell from "~/shared/table/cells/input-cell";
import DraggableRow from "~/shared/table/rows/draggable-row";
import Row from "~/shared/table/rows/row";
import Table from "~/shared/table/table";
import { buttonSharedStyles, normalButtonColor } from "~/shared/button/styles";
import type {
  Route
} from "../../../../.react-router/types/app/routes/initiative-lists/edit/+types/edit-initiative-list";
import type { InitiativeItemDto, InitiativeListDto } from "~/shared/api/initiative-lists";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Initiative List" },
    {
      name: "description",
      content: "This is a page to modify an initiative list",
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const initiativeListResponse = await fetch(
    `http://api:8080/api/InitiativeLists/${params.initiativeListId}`,
  );
  return (await initiativeListResponse.json()) as InitiativeListDto;
}

const tableGridColStyle = `grid-cols-[50px_1fr_3fr_1fr_1fr_50px]`;

export default function EditInitiativeList({
  loaderData: initiativeList,
}: Route.ComponentProps) {
  const [initiativeItems, setInitiativeItems] = useState<InitiativeItemDto[]>(
    initiativeList.initiativeItems,
  );
  const [activeId, setActiveId] = useState(initiativeList.activeId);
  const [round, setRound] = useState(initiativeList.round);

  const createEmptyInitiativeItem = () => ({
    id: uuidv4(),
    initiative: null,
    initiativeBonus: null,
    name: null,
    hp: null,
    ac: null,
    sortOrder: initiativeItems.length + 1,
  });

  const save = async () => {
    await fetch(
      `http://localhost:8080/api/InitiativeLists/${initiativeList.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: initiativeList.id,
          accountId: initiativeList.accountId,
          name: initiativeList.name,
          round,
          activeId,
          initiativeItems,
        } as InitiativeListDto),
      },
    );
  };

  const sort = () => {
    setInitiativeItems((prevState) => {
      const newState = [...prevState];
      newState.sort((a, b) => {
        const sortValue = (b.initiative ?? 0) - (a.initiative ?? 0);
        if (sortValue !== 0) return sortValue;
        return (a.name ?? "").localeCompare(b.name ?? "");
      });
      return newState.map((initiativeItem, index) => ({
        ...initiativeItem,
        sortOrder: index + 1,
      }));
    });
  };

  const rollAllEmpty = () => {
    setInitiativeItems((prevState) =>
      prevState.map((initiativeItem) => ({
        ...initiativeItem,
        initiative:
          initiativeItem.initiative == null
            ? roll()
            : initiativeItem.initiative,
      })),
    );
  };

  const roll = () => Math.floor(Math.random() * 20) + 1;

  const parseNumberValue = (value: string, prevValue: number | null) => {
    if (value === "") return null;

    const numberValue = parseInt(value);
    if (isNaN(numberValue)) return prevValue;
    else return numberValue;
  };

  const changeInitiativeItemValue = (
    index: number,
    value: Partial<InitiativeItemDto>,
  ) =>
    setInitiativeItems((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1, {
        ...prevState[index],
        ...value,
      });
      return newState;
    });

  const activeIndex = initiativeItems.findIndex(
    (initiativeItem) => initiativeItem.id === activeId,
  );

  const setPrevItemActive = () => {
    // if out of range, put the active index at 0
    if (activeIndex < 0 || activeIndex >= initiativeItems.length)
      setActiveId(initiativeItems[0].id);

    // if at the first element and its after the first round, go the previous round
    else if (activeIndex == 0 && round > 1) {
      const activeItem = initiativeItems[initiativeItems.length - 1];
      setActiveId(activeItem.id);
      setRound((prevState) => prevState - 1);
    }

    // if the index is not 0, move it back one
    else if (activeIndex > 0) {
      const activeItem = initiativeItems[activeIndex - 1];
      setActiveId(activeItem.id);
    }

    // if we reach here, the active index is 0, but the round is 1, do nothing
  };

  const setNextItemActive = () => {
    // if out of range, put the active index at 0
    if (activeIndex < 0 || activeIndex >= initiativeItems.length)
      setActiveId(initiativeItems[0].id);

    // if at the last element, move back to the first and go to the next round
    else if (activeIndex >= initiativeItems.length - 1) {
      const activeItem = initiativeItems[0];
      setActiveId(activeItem.id);
      setRound((prevState) => prevState + 1);
    }

    // if we reach here, it is within range, and not the last element, so just
    // move forward
    else {
      const activeItem = initiativeItems[activeIndex + 1];
      setActiveId(activeItem.id);
    }
  };

  return (
    <main>
      <header className="flex flex-col items-center gap-9"></header>
      <div className={"max-w-300 mx-auto"}>
        <h1 className={"text-2xl mt-4 mb-2"}>
          Encounter: {initiativeList.name}
        </h1>
        <div className={"mb-2 flex items-center"}>
          <h1 className={"text-2xl"}>Round {round}</h1>
          <div className={"flex items-center ml-auto gap-2"}>
            <button
              className={`${buttonSharedStyles} ${normalButtonColor}`}
              onClick={rollAllEmpty}
            >
              Roll All Empty
            </button>
            <button
              className={`${buttonSharedStyles} ${normalButtonColor}`}
              onClick={sort}
            >
              Sort
            </button>
            <button
              className={`${buttonSharedStyles} ${normalButtonColor}`}
              onClick={save}
            >
              Save
            </button>
          </div>
        </div>

        <Table gridColStyle={tableGridColStyle}>
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
              setInitiativeItems((prevState) =>
                move(prevState, event).map((initiativeItem, index) => ({
                  ...initiativeItem,
                  sortOrder: index + 1,
                })),
              );
            }}
          >
            {initiativeItems.map((initiativeItem, index) => (
              <DraggableRow
                gridColStyle={tableGridColStyle}
                index={index}
                id={initiativeItem.id}
                key={initiativeItem.id}
              >
                <InitiativeInputCell
                  active={initiativeItem.id === activeId}
                  value={initiativeItem.initiative ?? ""}
                  onChange={(e) =>
                    changeInitiativeItemValue(index, {
                      initiative: parseNumberValue(
                        e.target.value,
                        initiativeItems[index].initiative,
                      ),
                    })
                  }
                  onDiceClick={(e) =>
                    changeInitiativeItemValue(index, {
                      initiative: roll(),
                    })
                  }
                />
                <InputCell
                  active={initiativeItem.id === activeId}
                  value={initiativeItem.name ?? ""}
                  onChange={(e) =>
                    changeInitiativeItemValue(index, {
                      name: e.target.value == "" ? null : e.target.value,
                    })
                  }
                />
                <InputCell
                  active={initiativeItem.id === activeId}
                  value={initiativeItem.hp ?? ""}
                  onChange={(e) =>
                    changeInitiativeItemValue(index, {
                      hp: parseNumberValue(
                        e.target.value,
                        initiativeItems[index].hp,
                      ),
                    })
                  }
                />
                <InputCell
                  active={initiativeItem.id === activeId}
                  value={initiativeItem.ac ?? ""}
                  onChange={(e) =>
                    changeInitiativeItemValue(index, {
                      ac: parseNumberValue(
                        e.target.value,
                        initiativeItems[index].ac,
                      ),
                    })
                  }
                />
                <DeleteCell
                  onClick={() => {
                    if (initiativeItems.length === 1) return;

                    setInitiativeItems((prevState) => {
                      const newState = [...prevState];
                      newState.splice(index, 1);
                      return newState;
                    });
                    if (initiativeItem.id === activeId) setNextItemActive();
                  }}
                />
              </DraggableRow>
            ))}
          </DragDropProvider>
        </Table>
      </div>
      <footer
        className={"fixed bottom-0 left-0 right-0 bg-purple-900 py-4 mt-8"}
      >
        <div
          className={
            "max-w-300 mx-auto flex items-stretch justify-center gap-6"
          }
        >
          <button
            onClick={setPrevItemActive}
            className={`${buttonSharedStyles} ${normalButtonColor}`}
          >
            Prev
          </button>
          <button
            onClick={() =>
              setInitiativeItems((prevState) => [
                ...prevState,
                createEmptyInitiativeItem(),
              ])
            }
            className={`${buttonSharedStyles} bg-green-700`}
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
    </main>
  );
}

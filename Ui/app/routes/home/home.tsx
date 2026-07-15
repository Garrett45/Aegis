import type { Route } from "../../../.react-router/types/app/routes/home/+types/home";
import Table from "~/routes/home/table/table";
import Row from "~/routes/home/table/rows/row";
import HeadCell from "~/routes/home/table/cells/head-cell";
import InputCell from "~/routes/home/table/cells/input-cell";
import DeleteCell from "~/routes/home/table/cells/delete-cell";
import { useState } from "react";
import { FaDiceD20, FaPlus } from "react-icons/fa";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import DraggableRow from "~/routes/home/table/rows/draggable-row";
import { v4 as uuidv4 } from "uuid";

interface InitiativeItem {
  id: string;
  initiative: number | null;
  name: string | null;
  hp: number | null;
  ac: number | null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const tableGridColStyle = "grid-cols-[50px_1fr_3fr_1fr_1fr_50px]";

const normalButtonColor = "bg-sky-800";
const buttonSharedStyle = "px-4 py-2 text-xl cursor-pointer";

export default function Home() {
  const createEmptyInitiativeItem = () => ({
    id: uuidv4(),
    initiative: null,
    name: null,
    hp: null,
    ac: null,
  });

  const [initiativeItems, setInitiativeItems] = useState<InitiativeItem[]>([
    createEmptyInitiativeItem(),
  ]);
  const [activeId, setActiveId] = useState(initiativeItems[0].id);
  const [round, setRound] = useState(1);

  const sort = () => {
    setInitiativeItems((prevState) => {
      const newState = [...prevState];
      newState.sort((a, b) => {
        const sortValue = (b.initiative ?? 0) - (a.initiative ?? 0);
        if (sortValue !== 0) return sortValue;
        return (a.name ?? "").localeCompare(b.name ?? "");
      });
      return newState;
    });
  };

  const rollAllEmpty = () => {
    setInitiativeItems((prevState) =>
      prevState.map((initiativeItem) => ({
        ...initiativeItem,
        initiative:
          initiativeItem.initiative == null
            ? Math.floor(Math.random() * 20) + 1
            : initiativeItem.initiative,
      })),
    );
  };

  const parseNumberValue = (value: string, prevValue: number | null) => {
    if (value === "") return null;

    const numberValue = parseInt(value);
    if (isNaN(numberValue)) return prevValue;
    else return numberValue;
  };

  const changeInitiativeItemValue = (
    index: number,
    value: Partial<InitiativeItem>,
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
        <div className={"mt-4 mb-2 flex items-center"}>
          <h1 className={"text-2xl"}>Round {round}</h1>
          <div className={"flex items-center ml-auto gap-4"}>
            <button
              className={`${buttonSharedStyle} ${normalButtonColor}`}
              onClick={rollAllEmpty}
            >
              Roll All Empty
            </button>
            <button
              className={`${buttonSharedStyle} ${normalButtonColor}`}
              onClick={sort}
            >
              Sort
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
              setInitiativeItems((prevState) => move(prevState, event));
            }}
          >
            {initiativeItems.map((initiativeItem, index) => (
              <DraggableRow
                gridColStyle={tableGridColStyle}
                index={index}
                id={initiativeItem.id}
                key={initiativeItem.id}
              >
                <div className={"relative min-w-0"}>
                  <InputCell
                    active={initiativeItem.id === activeId}
                    inputMode={"numeric"}
                    value={initiativeItem.initiative ?? ""}
                    onChange={(e) =>
                      changeInitiativeItemValue(index, {
                        initiative: parseNumberValue(
                          e.target.value,
                          initiativeItems[index].initiative,
                        ),
                      })
                    }
                  />
                  <FaDiceD20
                    className={
                      "absolute right-2 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                    }
                  />
                </div>

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
                    setNextItemActive();
                  }}
                />
              </DraggableRow>
            ))}
          </DragDropProvider>
        </Table>
      </div>
      <footer
        className={"absolute bottom-0 left-0 right-0 bg-purple-900 py-4 mt-8"}
      >
        <div
          className={
            "max-w-300 mx-auto flex items-stretch justify-center gap-6"
          }
        >
          <button
            onClick={setPrevItemActive}
            className={`${buttonSharedStyle} ${normalButtonColor}`}
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
            className={`${buttonSharedStyle} bg-green-700`}
          >
            <FaPlus />
          </button>
          <button
            onClick={setNextItemActive}
            className={`${buttonSharedStyle} ${normalButtonColor}`}
          >
            Next
          </button>
        </div>
      </footer>
    </main>
  );
}

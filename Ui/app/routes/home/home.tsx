import type { Route } from "../../../.react-router/types/app/routes/home/+types/home";
import InitiativeTable from "~/routes/home/initiative-table/initiative-table";
import InitiativeRow from "~/routes/home/initiative-table/rows/initiative-row";
import InitiativeHeadCell from "~/routes/home/initiative-table/cells/initiative-head-cell";
import InitiativeInputCell from "~/routes/home/initiative-table/cells/initiative-input-cell";
import InitiativeDeleteCell from "~/routes/home/initiative-table/cells/initiative-delete-cell";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { initiativeCellSharedStyles } from "~/routes/home/initiative-table/cells/styles";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import InitiativeDraggableRow from "~/routes/home/initiative-table/rows/initiative-draggable-row";
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

const tableGridColStyle = "grid-cols-[50px_1fr_2fr_1fr_1fr_50px]";

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
        <h1 className={"text-2xl mt-4 mb-2"}>Round {round}</h1>
        <InitiativeTable gridColStyle={tableGridColStyle}>
          <InitiativeRow>
            <InitiativeHeadCell />
            <InitiativeHeadCell>Initiative</InitiativeHeadCell>
            <InitiativeHeadCell>Name</InitiativeHeadCell>
            <InitiativeHeadCell>HP</InitiativeHeadCell>
            <InitiativeHeadCell>AC</InitiativeHeadCell>
            <InitiativeHeadCell />
          </InitiativeRow>
          <DragDropProvider
            onDragEnd={(event) => {
              setInitiativeItems((prevState) => move(prevState, event));
            }}
          >
            {initiativeItems.map((initiativeItem, index) => (
              <InitiativeDraggableRow
                gridColStyle={tableGridColStyle}
                index={index}
                id={initiativeItem.id}
                key={initiativeItem.id}
              >
                <InitiativeInputCell
                  type={"number"}
                  active={initiativeItem.id === activeId}
                  value={initiativeItem.initiative}
                  onChange={(e) =>
                    changeInitiativeItemValue(index, {
                      initiative: Number(e.target.value),
                    })
                  }
                />
                <InitiativeInputCell
                  active={initiativeItem.id === activeId}
                  value={initiativeItem.name}
                  onChange={(e) =>
                    changeInitiativeItemValue(index, {
                      name: e.target.value,
                    })
                  }
                />
                <InitiativeInputCell
                  type={"number"}
                  active={initiativeItem.id === activeId}
                  value={initiativeItem.hp}
                  onChange={(e) =>
                    changeInitiativeItemValue(index, {
                      hp: Number(e.target.value),
                    })
                  }
                />
                <InitiativeInputCell
                  type={"number"}
                  active={initiativeItem.id === activeId}
                  value={initiativeItem.ac}
                  onChange={(e) =>
                    changeInitiativeItemValue(index, {
                      ac: Number(e.target.value),
                    })
                  }
                />
                <InitiativeDeleteCell
                  onClick={() => {
                    setInitiativeItems((prevState) => {
                      const newState = [...prevState];
                      newState.splice(index, 1);
                      return newState;
                    });
                    setNextItemActive();
                  }}
                />
              </InitiativeDraggableRow>
            ))}
          </DragDropProvider>
        </InitiativeTable>
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
            className={`${initiativeCellSharedStyles} bg-sky-800 cursor-pointer`}
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
            className={`${initiativeCellSharedStyles} bg-green-700 cursor-pointer`}
          >
            <FaPlus />
          </button>
          <button
            onClick={setNextItemActive}
            className={`${initiativeCellSharedStyles} bg-sky-800 cursor-pointer`}
          >
            Next
          </button>
        </div>
      </footer>
    </main>
  );
}

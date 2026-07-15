import type { Route } from "../../../.react-router/types/app/routes/home/+types/home";
import InitiativeTable from "~/routes/home/initiative-table/initiative-table";
import InitiativeRow from "~/routes/home/initiative-table/initiative-row";
import InitiativeHeadCell from "~/routes/home/initiative-table/cells/initiative-head-cell";
import InitiativeInputCell from "~/routes/home/initiative-table/cells/initiative-input-cell";
import InitiativeDeleteCell from "~/routes/home/initiative-table/cells/initiative-delete-cell";
import InitiativeDragCell from "~/routes/home/initiative-table/cells/initiative-drag-cell";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { initiativeCellSharedStyles } from "~/routes/home/initiative-table/cells/styles";

interface InitiativeItem {
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

export default function Home() {
  const createEmptyInitiativeItem = () => ({
    initiative: null,
    name: null,
    hp: null,
    ac: null,
  });

  const [initiativeItems, setInitiativeItems] = useState<InitiativeItem[]>([
    createEmptyInitiativeItem(),
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
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

  const prevItem = () => {
    if (activeIndex <= 0) {
      setActiveIndex(initiativeItems.length - 1);
      if (round > 1) setRound((prevState) => prevState - 1);
    } else {
      setActiveIndex((prevState) => prevState - 1);
    }
  };

  const nextItem = () => {
    if (activeIndex >= initiativeItems.length - 1) {
      setActiveIndex(0);
      setRound((prevState) => prevState + 1);
    } else {
      setActiveIndex((prevState) => prevState + 1);
    }
  };

  return (
    <main>
      <header className="flex flex-col items-center gap-9"></header>
      <div className={"max-w-300 mx-auto"}>
        <h1 className={"text-2xl mt-4 mb-2"}>Round {round}</h1>
        <InitiativeTable>
          <InitiativeRow>
            <InitiativeHeadCell />
            <InitiativeHeadCell>Initiative</InitiativeHeadCell>
            <InitiativeHeadCell>Name</InitiativeHeadCell>
            <InitiativeHeadCell>HP</InitiativeHeadCell>
            <InitiativeHeadCell>AC</InitiativeHeadCell>
            <InitiativeHeadCell />
          </InitiativeRow>
          {initiativeItems.map((initiativeItem, index) => (
            <InitiativeRow key={index}>
              <InitiativeDragCell />
              <InitiativeInputCell
                type={"number"}
                active={index === activeIndex}
                value={initiativeItem.initiative}
                onChange={(e) =>
                  changeInitiativeItemValue(index, {
                    initiative: Number(e.target.value),
                  })
                }
              />
              <InitiativeInputCell
                active={index === activeIndex}
                value={initiativeItem.name}
                onChange={(e) =>
                  changeInitiativeItemValue(index, {
                    name: e.target.value,
                  })
                }
              />
              <InitiativeInputCell
                type={"number"}
                active={index === activeIndex}
                value={initiativeItem.hp}
                onChange={(e) =>
                  changeInitiativeItemValue(index, {
                    hp: Number(e.target.value),
                  })
                }
              />
              <InitiativeInputCell
                type={"number"}
                active={index === activeIndex}
                value={initiativeItem.ac}
                onChange={(e) =>
                  changeInitiativeItemValue(index, {
                    ac: Number(e.target.value),
                  })
                }
              />
              <InitiativeDeleteCell
                onClick={() =>
                  setInitiativeItems((prevState) => {
                    const newState = [...prevState];
                    newState.splice(index, 1);
                    return newState;
                  })
                }
              />
            </InitiativeRow>
          ))}
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
            onClick={prevItem}
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
            onClick={nextItem}
            className={`${initiativeCellSharedStyles} bg-sky-800 cursor-pointer`}
          >
            Next
          </button>
        </div>
      </footer>
    </main>
  );
}

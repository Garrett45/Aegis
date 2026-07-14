import type { Route } from "../../../.react-router/types/app/routes/home/+types/home";
import InitiativeTable from "~/routes/home/initiative-table/initiative-table";
import InitiativeRow from "~/routes/home/initiative-table/initiative-row";
import InitiativeHeadCell from "~/routes/home/initiative-table/cells/initiative-head-cell";
import InitiativeInputCell from "~/routes/home/initiative-table/cells/initiative-input-cell";
import InitiativeDeleteCell from "~/routes/home/initiative-table/cells/initiative-delete-cell";
import InitiativeDragCell from "~/routes/home/initiative-table/cells/initiative-drag-cell";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { baseInitiativeCellStyles } from "~/routes/home/initiative-table/cells/styles";

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

  return (
    <main>
      <header className="flex flex-col items-center gap-9"></header>
      <div className={"max-w-300 mx-auto"}>
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
                value={initiativeItem.initiative}
                onChange={(e) =>
                  changeInitiativeItemValue(index, {
                    initiative: Number(e.target.value),
                  })
                }
              />
              <InitiativeInputCell
                value={initiativeItem.name}
                onChange={(e) =>
                  changeInitiativeItemValue(index, {
                    name: e.target.value,
                  })
                }
              />
              <InitiativeInputCell
                type={"number"}
                value={initiativeItem.hp}
                onChange={(e) =>
                  changeInitiativeItemValue(index, {
                    hp: Number(e.target.value),
                  })
                }
              />
              <InitiativeInputCell
                type={"number"}
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
        <div className={"my-8"}>
          <button
            onClick={() =>
              setInitiativeItems((prevState) => [
                ...prevState,
                createEmptyInitiativeItem(),
              ])
            }
            className={`${baseInitiativeCellStyles} cursor-pointer`}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </main>
  );
}

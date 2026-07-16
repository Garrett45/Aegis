import { FaDiceD20, FaMinus, FaPlus } from "react-icons/fa";
import React, { useState } from "react";
import InputCell from "~/shared/components/table/cells/input-cell";
import { useFloating, useFocus, useInteractions } from "@floating-ui/react";
import type { InitiativeListItemDto } from "~/shared/api/initiative-lists";
import { parseNumberValue } from "~/routes/initiative-lists/edit/parsers";

interface InitiativeInputCell {
  active?: boolean;
  initiativeListItem: InitiativeListItemDto;
  index: number;
  onDiceClick?: React.MouseEventHandler<SVGElement>;
  changeInitiativeListItemValue: (
    index: number,
    value: Partial<InitiativeListItemDto>,
  ) => void;
  roll: () => number;
}

export default function InitiativeInputCell(props: InitiativeInputCell) {
  const initiativeBonus = props.initiativeListItem.initiativeBonus ?? 0;

  const [isBonusOpen, setIsBonusOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isBonusOpen,
    onOpenChange: setIsBonusOpen,
  });
  const focus = useFocus(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([focus]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={"relative min-w-0"}
      >
        <InputCell
          active={props.active}
          value={props.initiativeListItem.initiative ?? ""}
          onChange={(e) =>
            props.changeInitiativeListItemValue(props.index, {
              initiative: parseNumberValue(
                e.target.value,
                props.initiativeListItem.initiative,
              ),
            })
          }
          inputMode={"numeric"}
        />
        <FaDiceD20
          onClick={() =>
            props.changeInitiativeListItemValue(props.index, {
              initiative: props.roll() + initiativeBonus,
            })
          }
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-xl cursor-pointer`}
        />
        {isBonusOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={
              "z-1 bg-white px-2 py-4 border-1 border-[#ddd] flex items-center justify-center gap-2"
            }
            {...getFloatingProps()}
          >
            <div className={"flex flex-col items-center"}>
              <FaPlus
                className={"cursor-pointer"}
                onClick={() =>
                  props.changeInitiativeListItemValue(props.index, {
                    initiativeBonus: initiativeBonus + 1,
                  })
                }
              />
              <FaMinus
                className={"cursor-pointer"}
                onClick={() =>
                  props.changeInitiativeListItemValue(props.index, {
                    initiativeBonus: initiativeBonus - 1,
                  })
                }
              />
            </div>
            <p className={"text-xl"}>
              Bonus:{" "}
              {initiativeBonus > 0 ? `+${initiativeBonus}` : initiativeBonus}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

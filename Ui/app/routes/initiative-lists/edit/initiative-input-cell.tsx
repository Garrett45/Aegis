import { FaDiceD20 } from "react-icons/fa";
import React, { type InputHTMLAttributes, useState } from "react";
import InputCell from "~/shared/table/cells/input-cell";

interface InitiativeInputCell {
  active?: boolean;
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  onDiceClick?: React.MouseEventHandler<SVGElement>;
}

export default function InitiativeInputCell(props: InitiativeInputCell) {
  const [showD20, setShowD20] = useState(false);

  return (
    <div
      className={"relative min-w-0"}
      onMouseEnter={() => setShowD20(true)}
      onMouseLeave={() => setShowD20(false)}
    >
      <InputCell
        active={props.active}
        value={props.value}
        onChange={props.onChange}
        inputMode={"numeric"}
      />
      <FaDiceD20
        onClick={props.onDiceClick}
        className={`absolute right-2 top-1/2 -translate-y-1/2 text-xl cursor-pointer ${showD20 ? "" : "hidden"}`}
      />
    </div>
  );
}

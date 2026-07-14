import { baseInitiativeCellStyles } from "~/routes/home/initiative-table/cells/styles";
import React from "react";
import { FaTrash } from "react-icons/fa";

interface InitiativeDeleteCellProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export default function InitiativeDeleteCell(props: InitiativeDeleteCellProps) {
  return (
    <div
      className={`${baseInitiativeCellStyles} bg-red-800 flex items-center justify-center cursor-pointer`}
      onClick={props.onClick}
    >
      <FaTrash />
    </div>
  );
}

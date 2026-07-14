import { baseInitiativeCellStyles } from "~/routes/home/initiative-table/cells/styles";
import { FaGripVertical } from "react-icons/fa";
import React from "react";

export default function InitiativeDragCell() {
  return (
    <div
      className={`${baseInitiativeCellStyles} flex items-center justify-center cursor-pointer`}
    >
      <FaGripVertical />
    </div>
  );
}

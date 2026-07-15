import { initiativeCellStyles } from "~/routes/home/initiative-table/cells/styles";
import { FaGripVertical } from "react-icons/fa";
import React, { type RefObject } from "react";

interface InitiativeDragCellProps {
  ref: RefObject<HTMLDivElement | null>;
}

export default function InitiativeDragCell(props: InitiativeDragCellProps) {
  return (
    <div
      ref={props.ref}
      className={`${initiativeCellStyles(false)} flex items-center justify-center cursor-grab`}
    >
      <FaGripVertical />
    </div>
  );
}

import { cellStyles } from "~/routes/home/table/cells/styles";
import { FaGripVertical } from "react-icons/fa";
import React, { type RefObject } from "react";

interface DragCellProps {
  ref: RefObject<HTMLDivElement | null>;
}

export default function DragCell(props: DragCellProps) {
  return (
    <div
      ref={props.ref}
      className={`${cellStyles(false)} flex items-center justify-center cursor-grab`}
    >
      <FaGripVertical />
    </div>
  );
}

import { cellSharedStyles } from "~/shared/components/table/cells/styles";
import React from "react";
import { FaTrash } from "react-icons/fa";

interface DeleteCellProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export default function DeleteCell(props: DeleteCellProps) {
  return (
    <div
      className={`${cellSharedStyles} bg-red-800 text-white flex items-center justify-center cursor-pointer`}
      onClick={props.onClick}
    >
      <FaTrash />
    </div>
  );
}

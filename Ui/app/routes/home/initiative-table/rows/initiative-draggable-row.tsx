import React, { useRef, useState } from "react";
import InitiativeDragCell from "~/routes/home/initiative-table/cells/initiative-drag-cell";
import { useSortable } from "@dnd-kit/react/sortable";
import { initiativeRowSharedStyles } from "~/routes/home/initiative-table/rows/styles";

interface InitiativeDraggableRowProps {
  id: string;
  index: number;
  gridColStyle: string;
  children?: React.ReactNode;
}

export default function InitiativeDraggableRow(
  props: InitiativeDraggableRowProps,
) {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const { isDragging } = useSortable({
    id: props.id,
    index: props.index,
    element,
    handle: handleRef,
  });

  return (
    <div
      ref={setElement}
      className={`${initiativeRowSharedStyles} ${props.gridColStyle}`}
    >
      <InitiativeDragCell ref={handleRef} />
      {props.children}
    </div>
  );
}

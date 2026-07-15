import React, { useRef, useState } from "react";
import DragCell from "~/shared/table/cells/drag-cell";
import { useSortable } from "@dnd-kit/react/sortable";
import { rowSharedStyles } from "~/shared/table/rows/styles";

interface DraggableRowProps {
  id: string;
  index: number;
  gridColStyle: string;
  children?: React.ReactNode;
}

export default function DraggableRow(props: DraggableRowProps) {
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
      className={`${rowSharedStyles} ${props.gridColStyle}`}
    >
      <DragCell ref={handleRef} />
      {props.children}
    </div>
  );
}

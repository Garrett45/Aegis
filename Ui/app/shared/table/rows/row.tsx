import React from "react";
import { rowSharedStyles } from "~/shared/table/rows/styles";

interface RowProps {
  children?: React.ReactNode;
}

export default function Row(props: RowProps) {
  return (
    <div className={`${rowSharedStyles} grid-cols-subgrid`}>
      {props.children}
    </div>
  );
}

import { cellStyles } from "~/shared/table/cells/styles";
import React from "react";

interface HeadCellProps {
  children?: React.ReactNode;
}

export default function HeadCell(props: HeadCellProps) {
  return (
    <div className={`${cellStyles(false)} font-bold`}>{props.children}</div>
  );
}

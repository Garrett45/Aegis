import React from "react";
import { cellStyles } from "~/shared/components/table/cells/styles";

interface CellProps {
  children?: React.ReactNode;
  active?: boolean;
}

export default function Cell(props: CellProps) {
  return <div className={cellStyles(props.active)}>{props.children}</div>;
}

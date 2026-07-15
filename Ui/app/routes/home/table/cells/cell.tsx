import React from "react";
import { cellStyles } from "~/routes/home/table/cells/styles";

interface InitiativeCellProps {
  children?: React.ReactNode;
  active?: boolean;
}

export default function Cell(props: InitiativeCellProps) {
  return <div className={cellStyles(props.active)}>{props.children}</div>;
}

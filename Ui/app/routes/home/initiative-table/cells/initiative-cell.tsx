import React from "react";
import { baseInitiativeCellStyles } from "~/routes/home/initiative-table/cells/styles";

interface InitiativeCellProps {
  children?: React.ReactNode;
}

export default function InitiativeCell(props: InitiativeCellProps) {
  return <div className={baseInitiativeCellStyles}>{props.children}</div>;
}

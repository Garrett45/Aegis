import React from "react";
import { initiativeCellStyles } from "~/routes/home/initiative-table/cells/styles";

interface InitiativeCellProps {
  children?: React.ReactNode;
  active?: boolean;
}

export default function InitiativeCell(props: InitiativeCellProps) {
  return (
    <div className={initiativeCellStyles(props.active)}>{props.children}</div>
  );
}

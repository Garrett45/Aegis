import { initiativeCellStyles } from "~/routes/home/initiative-table/cells/styles";
import React from "react";

interface InitiativeHeadCellProps {
  children?: React.ReactNode;
}

export default function InitiativeHeadCell(props: InitiativeHeadCellProps) {
  return (
    <div className={`${initiativeCellStyles(false)} font-bold`}>
      {props.children}
    </div>
  );
}

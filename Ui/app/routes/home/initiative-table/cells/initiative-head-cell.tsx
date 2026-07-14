import { baseInitiativeCellStyles } from "~/routes/home/initiative-table/cells/styles";
import React from "react";

interface InitiativeHeadCellProps {
  children?: React.ReactNode;
}

export default function InitiativeHeadCell(props: InitiativeHeadCellProps) {
  return (
    <div className={`${baseInitiativeCellStyles} font-bold`}>
      {props.children}
    </div>
  );
}

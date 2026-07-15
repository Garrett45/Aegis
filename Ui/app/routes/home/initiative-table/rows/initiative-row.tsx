import React from "react";
import { initiativeRowSharedStyles } from "~/routes/home/initiative-table/rows/styles";

interface InitiativeRowProps {
  children?: React.ReactNode;
}

export default function InitiativeRow(props: InitiativeRowProps) {
  return (
    <div className={`${initiativeRowSharedStyles} grid-cols-subgrid`}>
      {props.children}
    </div>
  );
}

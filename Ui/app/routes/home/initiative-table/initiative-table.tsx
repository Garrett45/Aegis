import React from "react";
import { initiativeTableGap } from "~/routes/home/initiative-table/shared/styles";

interface InitiativeTableProps {
  gridColStyle: string;
  children?: React.ReactNode;
}

export default function InitiativeTable(props: InitiativeTableProps) {
  return (
    <div
      className={`mx-auto grid ${props.gridColStyle} ${initiativeTableGap} bg-white`}
    >
      {props.children}
    </div>
  );
}

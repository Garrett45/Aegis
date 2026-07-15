import React from "react";
import { tableGap } from "~/routes/home/table/shared/styles";

interface InitiativeTableProps {
  gridColStyle: string;
  children?: React.ReactNode;
}

export default function Table(props: InitiativeTableProps) {
  return (
    <div className={`mx-auto grid ${props.gridColStyle} ${tableGap} bg-white`}>
      {props.children}
    </div>
  );
}

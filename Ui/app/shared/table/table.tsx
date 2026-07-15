import React from "react";
import { tableGap } from "~/shared/table/styles";

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

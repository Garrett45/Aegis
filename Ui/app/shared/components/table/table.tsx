import React from "react";
import { tableGap } from "~/shared/components/table/styles";

interface InitiativeTableProps {
  gridColStyle: string;
  children?: React.ReactNode;
}

export default function Table(props: InitiativeTableProps) {
  return (
    <div className={`mx-auto grid ${props.gridColStyle} ${tableGap} bg-black`}>
      {props.children}
    </div>
  );
}

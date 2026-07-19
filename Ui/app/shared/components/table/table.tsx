import React from "react";
import { tableGap } from "~/shared/components/table/styles";

interface InitiativeTableProps {
  gridColStyle: string;
  minWidthStyle?: string;
  children?: React.ReactNode;
}

export default function Table(props: InitiativeTableProps) {
  return (
    <div className={`w-full overflow-x-scroll`}>
      <div
        className={`mx-auto grid ${props.gridColStyle} ${props.minWidthStyle} ${tableGap} bg-black`}
      >
        {props.children}
      </div>
    </div>
  );
}

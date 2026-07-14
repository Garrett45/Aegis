import React from "react";

interface InitiativeTableProps {
  children?: React.ReactNode;
}

export default function InitiativeTable(props: InitiativeTableProps) {
  return (
    <div
      className={
        "mx-auto grid grid-cols-[50px_1fr_2fr_1fr_1fr_50px] gap-1 bg-white"
      }
    >
      {props.children}
    </div>
  );
}

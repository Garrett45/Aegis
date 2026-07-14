import React from "react";

interface InitiativeRowProps {
  children?: React.ReactNode;
}

export default function InitiativeRow(props: InitiativeRowProps) {
  return (
    <div className={"w-full grid col-span-full grid-cols-subgrid"}>
      {props.children}
    </div>
  );
}

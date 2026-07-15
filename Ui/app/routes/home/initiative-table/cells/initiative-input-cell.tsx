import React, { type ChangeEventHandler, type HTMLInputTypeAttribute } from "react";
import { initiativeCellStyles } from "~/routes/home/initiative-table/cells/styles";

interface InitiativeInputCellProps {
  children?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  value: string | number | readonly string[] | null;
  onChange: ChangeEventHandler<HTMLInputElement>;
  active?: boolean;
}

export default function InitiativeInputCell(props: InitiativeInputCellProps) {
  return (
    <input
      className={`${initiativeCellStyles(props.active)} min-w-0`}
      type={props.type}
      value={props.value ?? ""}
      onChange={props.onChange}
    >
      {props.children}
    </input>
  );
}

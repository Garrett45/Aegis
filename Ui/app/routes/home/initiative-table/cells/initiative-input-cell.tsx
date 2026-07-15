import React, { type HTMLInputTypeAttribute, type InputHTMLAttributes } from "react";
import { initiativeCellStyles } from "~/routes/home/initiative-table/cells/styles";

interface InitiativeInputCellProps {
  children?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  active?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}

export default function InitiativeInputCell(props: InitiativeInputCellProps) {
  return (
    <input
      className={`${initiativeCellStyles(props.active)} min-w-0`}
      type={props.type}
      value={props.value}
      onChange={props.onChange}
      inputMode={props.inputMode}
    >
      {props.children}
    </input>
  );
}

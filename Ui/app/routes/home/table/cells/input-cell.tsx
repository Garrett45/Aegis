import React, {
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes,
} from "react";
import { cellStyles } from "~/routes/home/table/cells/styles";

interface InputCellProps {
  children?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  active?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}

export default function InputCell(props: InputCellProps) {
  return (
    <input
      className={`${cellStyles(props.active)} min-w-0 w-full`}
      type={props.type}
      value={props.value}
      onChange={props.onChange}
      inputMode={props.inputMode}
    >
      {props.children}
    </input>
  );
}

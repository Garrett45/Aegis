import {
  buttonSharedStyles,
  normalButtonColor,
} from "~/shared/components/button/styles";
import React from "react";

interface MainButtonProps extends Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  "className"
> {}

export default function MainButton(props: MainButtonProps) {
  return (
    <button
      className={`${buttonSharedStyles} ${normalButtonColor}`}
      {...props}
    />
  );
}

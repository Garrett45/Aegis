import React from "react";
import { cellStyles } from "~/shared/components/table/cells/styles";
import { Link, type LinkProps } from "react-router";

interface LinkCellProps extends Omit<LinkProps, "className"> {
  active?: boolean;
}

export default function LinkCell(props: LinkCellProps) {
  return (
    <Link
      {...props}
      className={`${cellStyles(props.active)} cursor-pointer hover:underline decoration-sky-800 decoration-3`}
    />
  );
}

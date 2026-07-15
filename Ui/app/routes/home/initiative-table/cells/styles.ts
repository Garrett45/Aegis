export const initiativeCellBackgroundColor = "bg-purple-900";
export const initiativeCellActiveBackgroundColor = "bg-sky-900";
export const initiativeCellSharedStyles = `px-4 py-2 text-xl`;
export const initiativeCellStyles = (active?: boolean) =>
  `${(active ?? false) ? initiativeCellActiveBackgroundColor : initiativeCellBackgroundColor} ${initiativeCellSharedStyles}`;

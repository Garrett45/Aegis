export const cellBackgroundColor = "bg-purple-900";
export const cellActiveBackgroundColor = "bg-sky-900";
export const cellSharedStyles = `px-4 py-2 text-xl`;
export const cellStyles = (active?: boolean) =>
  `${(active ?? false) ? cellActiveBackgroundColor : cellBackgroundColor} ${cellSharedStyles}`;

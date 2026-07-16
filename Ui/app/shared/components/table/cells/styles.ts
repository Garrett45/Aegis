export const cellBackgroundColor = "bg-white";
export const cellSharedStyles = `px-4 py-2 text-xl`;
export const cellStyles = (active?: boolean) =>
  `${(active ?? false) ? "bg-highlight" : cellBackgroundColor} ${cellSharedStyles}`;

export const parseNumberValue = (value: string, prevValue: number | null) => {
  if (value === "") return null;

  const numberValue = parseInt(value);
  if (isNaN(numberValue)) return prevValue;
  else return numberValue;
};

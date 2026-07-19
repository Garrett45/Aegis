import type { InitiativeListItemDto } from "~/shared/api/initiative-lists";

export interface InitiativeListItems {
  activeId: string;
  round: number;
}

export const findPrevActiveInitiativeListItemPosition = (
  initiativeListItems: InitiativeListItemDto[],
  activeInitiativeListItemPosition: InitiativeListItems,
) => {
  const activeIndex = initiativeListItems.findIndex(
    (initiativeListItem) =>
      initiativeListItem.id === activeInitiativeListItemPosition.activeId,
  );

  // if out of range, put the active index at 0
  if (activeIndex < 0 || activeIndex >= initiativeListItems.length)
    return {
      ...activeInitiativeListItemPosition,
      activeId: initiativeListItems[0].id,
    };

  // if at the first element and its after the first round, go the previous round
  else if (activeIndex == 0 && activeInitiativeListItemPosition.round > 1) {
    const activeItem = initiativeListItems[initiativeListItems.length - 1];
    return {
      activeId: activeItem.id,
      round: activeInitiativeListItemPosition.round - 1,
    };
  }

  // if the index is not 0, move it back one
  else if (activeIndex > 0) {
    const activeItem = initiativeListItems[activeIndex - 1];
    return {
      ...activeInitiativeListItemPosition,
      activeId: activeItem.id,
    };
  }

  // if we reach here, the active index is 0, but the round is 1, do nothing
  return activeInitiativeListItemPosition;
};

export const findNextActiveInitiativeListItemPosition = (
  initiativeListItems: InitiativeListItemDto[],
  activeInitiativeListItemPosition: InitiativeListItems,
) => {
  const activeIndex = initiativeListItems.findIndex(
    (initiativeListItem) =>
      initiativeListItem.id === activeInitiativeListItemPosition.activeId,
  );

  // if out of range, put the active index at 0
  if (activeIndex < 0 || activeIndex >= initiativeListItems.length)
    return {
      ...activeInitiativeListItemPosition,
      activeId: initiativeListItems[0].id,
    };

  // if at the last element, move back to the first and go to the next round
  else if (activeIndex >= initiativeListItems.length - 1) {
    const activeItem = initiativeListItems[0];
    return {
      activeId: activeItem.id,
      round: activeInitiativeListItemPosition.round + 1,
    };
  }

  const activeItem = initiativeListItems[activeIndex + 1];
  return {
    ...activeInitiativeListItemPosition,
    activeId: activeItem.id,
  };
};

export const sortInitiativeListItems = (
  initiativeListItems: InitiativeListItemDto[],
) => {
  const newInitiativeListItems = [...initiativeListItems];
  newInitiativeListItems.sort((a, b) => {
    const initiativeSortValue = (b.initiative ?? 0) - (a.initiative ?? 0);
    if (initiativeSortValue !== 0) return initiativeSortValue;

    const initiativeBonusSortValue =
      (b.initiativeBonus ?? 0) - (a.initiativeBonus ?? 0);
    if (initiativeBonusSortValue !== 0) return initiativeBonusSortValue;

    const nameSortValue = (a.name ?? "").localeCompare(b.name ?? "");
    if (nameSortValue !== 0) return nameSortValue;

    return a.id.localeCompare(b.id);
  });
  return newInitiativeListItems.map((initiativeListItem, index) => ({
    ...initiativeListItem,
    sortOrder: index + 1,
  }));
};

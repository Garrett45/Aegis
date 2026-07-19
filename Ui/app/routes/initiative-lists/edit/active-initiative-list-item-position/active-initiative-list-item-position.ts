import type { InitiativeListItemDto } from "~/shared/api/initiative-lists";

export interface ActiveInitiativeListItemPosition {
  activeId: string;
  round: number;
}

export const findPrevActiveInitiativeListItemPosition = (
  initiativeListItems: InitiativeListItemDto[],
  activeInitiativeListItemPosition: ActiveInitiativeListItemPosition,
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
  activeInitiativeListItemPosition: ActiveInitiativeListItemPosition,
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

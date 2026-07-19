import {describe, expect, test} from "vitest";
import type {InitiativeListItemDto} from "~/shared/api/initiative-lists";
import {v4 as uuidv4} from "uuid";
import {
  findNextActiveInitiativeListItemPosition,
  findPrevActiveInitiativeListItemPosition,
} from "~/routes/initiative-lists/edit/active-initiative-list-item-position/active-initiative-list-item-position";

const testInitiativeListItems: InitiativeListItemDto[] = [
  {
    id: uuidv4(),
    initiative: 16,
    initiativeBonus: 1,
    name: "Ardyn",
    hp: 25,
    ac: 15,
    sortOrder: 1,
  },
  {
    id: uuidv4(),
    initiative: 16,
    initiativeBonus: -1,
    name: "Mortimer",
    hp: 38,
    ac: 18,
    sortOrder: 2,
  },
  {
    id: uuidv4(),
    initiative: 15,
    initiativeBonus: 3,
    name: "Nippsy",
    hp: 12,
    ac: 8,
    sortOrder: 3,
  },
];

describe("findPrevActiveInitiativeListItemPosition", () => {
  test("if first round and first item, it does not change", () => {
    const activeInitiativeListItemPosition = {
      activeId: testInitiativeListItems[0].id,
      round: 1,
    };
    expect(
      findPrevActiveInitiativeListItemPosition(
        testInitiativeListItems,
        activeInitiativeListItemPosition,
      ),
    ).toMatchObject(activeInitiativeListItemPosition);
  });

  test("if first round and not first item, goes to previous item", () => {
    const activeInitiativeListItemPosition = {
      activeId: testInitiativeListItems[1].id,
      round: 1,
    };
    expect(
      findPrevActiveInitiativeListItemPosition(
        testInitiativeListItems,
        activeInitiativeListItemPosition,
      ),
    ).toMatchObject({
      activeId: testInitiativeListItems[0].id,
      round: 1,
    });
  });

  test("if second round and not first item, goes to previous item", () => {
    const activeInitiativeListItemPosition = {
      activeId: testInitiativeListItems[1].id,
      round: 2,
    };
    expect(
      findPrevActiveInitiativeListItemPosition(
        testInitiativeListItems,
        activeInitiativeListItemPosition,
      ),
    ).toMatchObject({
      activeId: testInitiativeListItems[0].id,
      round: 2,
    });
  });

  test("if not first round and first item, goes to last item of previous round", () => {
    const activeInitiativeListItemPosition = {
      activeId: testInitiativeListItems[0].id,
      round: 2,
    };
    expect(
      findPrevActiveInitiativeListItemPosition(
        testInitiativeListItems,
        activeInitiativeListItemPosition,
      ),
    ).toMatchObject({
      activeId: testInitiativeListItems[testInitiativeListItems.length - 1].id,
      round: 1,
    });
  });

  test("if active id not in list, goes to first item of current round", () => {
    const activeInitiativeListItemPosition = {
      activeId: "NOT IN LIST",
      round: 2,
    };
    expect(
      findPrevActiveInitiativeListItemPosition(
        testInitiativeListItems,
        activeInitiativeListItemPosition,
      ),
    ).toMatchObject({
      activeId: testInitiativeListItems[0].id,
      round: 2,
    });
  });
});

describe("findNextActiveInitiativeListItemPosition", () => {
  test("if not last item, goes to next item", () => {
    const activeInitiativeListItemPosition = {
      activeId: testInitiativeListItems[0].id,
      round: 1,
    };
    expect(
      findNextActiveInitiativeListItemPosition(
        testInitiativeListItems,
        activeInitiativeListItemPosition,
      ),
    ).toMatchObject({
      activeId: testInitiativeListItems[1].id,
      round: 1,
    });
  });

  test("if last item, goes to first item of next round", () => {
    const activeInitiativeListItemPosition = {
      activeId: testInitiativeListItems[testInitiativeListItems.length - 1].id,
      round: 2,
    };
    expect(
      findNextActiveInitiativeListItemPosition(
        testInitiativeListItems,
        activeInitiativeListItemPosition,
      ),
    ).toMatchObject({
      activeId: testInitiativeListItems[0].id,
      round: 3,
    });
  });

  test("if active id not in list, goes to first item of current round", () => {
    const activeInitiativeListItemPosition = {
      activeId: "NOT IN LIST",
      round: 2,
    };
    expect(
      findNextActiveInitiativeListItemPosition(
        testInitiativeListItems,
        activeInitiativeListItemPosition,
      ),
    ).toMatchObject({
      activeId: testInitiativeListItems[0].id,
      round: 2,
    });
  });
});

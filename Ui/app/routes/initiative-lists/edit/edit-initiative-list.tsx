import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import InitiativeInputCell from "~/routes/initiative-lists/edit/initiative-input-cell";
import DeleteCell from "~/shared/components/table/cells/delete-cell";
import HeadCell from "~/shared/components/table/cells/head-cell";
import InputCell from "~/shared/components/table/cells/input-cell";
import DraggableRow from "~/shared/components/table/rows/draggable-row";
import Row from "~/shared/components/table/rows/row";
import Table from "~/shared/components/table/table";
import { buttonSharedStyles, normalButtonColor } from "~/shared/components/button/styles";
import type {
  Route
} from "../../../../.react-router/types/app/routes/initiative-lists/edit/+types/edit-initiative-list";
import {
  allInitiativeListsQueryKey,
  type InitiativeListDto,
  type InitiativeListItemDto
} from "~/shared/api/initiative-lists";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { appWidth } from "~/shared/components/layout/styles";
import { parseNumberValue } from "~/routes/initiative-lists/edit/parsers";
import { toast } from "react-toastify";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Initiative List" },
    {
      name: "description",
      content: "This is a page to modify an initiative list",
    },
  ];
}

const tableGridColStyle = `grid-cols-[50px_1fr_3fr_1fr_1fr_50px]`;

export default function EditInitiativeList({ params }: Route.ComponentProps) {
  const auth = useAuth();
  const {
    data: initiativeList,
    isPending: initiativeListPending,
    isFetchedAfterMount,
  } = useQuery({
    queryKey: ["initiativeList", params.initiativeListId],
    queryFn: async () => {
      const initiativeListResponse = await fetch(
        `http://localhost:8080/api/InitiativeLists/${params.initiativeListId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
          },
        },
      );
      return (await initiativeListResponse.json()) as InitiativeListDto;
    },
    enabled: auth.isAuthenticated,
  });

  if (typeof initiativeList === "undefined" || !isFetchedAfterMount)
    return undefined;
  return <InternalInitiativeList initiativeList={initiativeList} />;
}

interface InternalInitiativeListProps {
  initiativeList: InitiativeListDto;
}

const InternalInitiativeList = ({
  initiativeList,
}: InternalInitiativeListProps) => {
  const auth = useAuth();
  const [initiativeListItems, setInitiativeListItems] = useState<
    InitiativeListItemDto[]
  >(initiativeList.initiativeListItems);
  const [activeId, setActiveId] = useState(initiativeList.activeId);
  const [round, setRound] = useState(initiativeList.round);

  const createEmptyInitiativeListItem = () => ({
    id: uuidv4(),
    initiative: null,
    initiativeBonus: null,
    name: null,
    hp: null,
    ac: null,
    sortOrder: initiativeListItems.length + 1,
  });

  const queryClient = useQueryClient();
  const { mutate: save, isPending: isSavePending } = useMutation({
    mutationFn: async () => {
      await fetch(
        `http://localhost:8080/api/InitiativeLists/${initiativeList.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: initiativeList.id,
            accountId: initiativeList.accountId,
            name: initiativeList.name,
            round,
            activeId,
            initiativeListItems: initiativeListItems,
          } as InitiativeListDto),
        },
      );
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: allInitiativeListsQueryKey(auth),
      });
      toast.success("Content saved!");
    },
    onError: async () => {
      toast.error("An error occurred while saving initiative list");
    },
  });

  const sort = () => {
    setInitiativeListItems((prevState) => {
      const newState = [...prevState];
      newState.sort((a, b) => {
        const sortValue = (b.initiative ?? 0) - (a.initiative ?? 0);
        if (sortValue !== 0) return sortValue;
        return (a.name ?? "").localeCompare(b.name ?? "");
      });
      return newState.map((initiativeListItem, index) => ({
        ...initiativeListItem,
        sortOrder: index + 1,
      }));
    });
  };

  const rollAllEmpty = () => {
    setInitiativeListItems((prevState) =>
      prevState.map((initiativeListItem) => ({
        ...initiativeListItem,
        initiative:
          initiativeListItem.initiative == null
            ? roll() + (initiativeListItem.initiativeBonus ?? 0)
            : initiativeListItem.initiative,
      })),
    );
  };

  const roll = () => Math.floor(Math.random() * 20) + 1;

  const changeInitiativeListItemValue = (
    index: number,
    value: Partial<InitiativeListItemDto>,
  ) =>
    setInitiativeListItems((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1, {
        ...prevState[index],
        ...value,
      });
      return newState;
    });

  const activeIndex = initiativeListItems.findIndex(
    (initiativeListItem) => initiativeListItem.id === activeId,
  );

  const setPrevItemActive = () => {
    // if out of range, put the active index at 0
    if (activeIndex < 0 || activeIndex >= initiativeListItems.length)
      setActiveId(initiativeListItems[0].id);

    // if at the first element and its after the first round, go the previous round
    else if (activeIndex == 0 && round > 1) {
      const activeItem = initiativeListItems[initiativeListItems.length - 1];
      setActiveId(activeItem.id);
      setRound((prevState) => prevState - 1);
    }

    // if the index is not 0, move it back one
    else if (activeIndex > 0) {
      const activeItem = initiativeListItems[activeIndex - 1];
      setActiveId(activeItem.id);
    }

    // if we reach here, the active index is 0, but the round is 1, do nothing
  };

  const setNextItemActive = () => {
    // if out of range, put the active index at 0
    if (activeIndex < 0 || activeIndex >= initiativeListItems.length)
      setActiveId(initiativeListItems[0].id);

    // if at the last element, move back to the first and go to the next round
    else if (activeIndex >= initiativeListItems.length - 1) {
      const activeItem = initiativeListItems[0];
      setActiveId(activeItem.id);
      setRound((prevState) => prevState + 1);
    }

    // if we reach here, it is within range, and not the last element, so just
    // move forward
    else {
      const activeItem = initiativeListItems[activeIndex + 1];
      setActiveId(activeItem.id);
    }
  };

  return (
    <>
      <main className={"mb-8"}>
        <div className={`${appWidth} mx-auto`}>
          <h1 className={"text-2xl mt-4 mb-2"}>
            Encounter: {initiativeList.name}
          </h1>
          <div className={"mb-2 flex items-center"}>
            <h1 className={"text-2xl"}>Round {round}</h1>
            <div className={"flex items-center ml-auto gap-2"}>
              <button
                className={`${buttonSharedStyles} ${normalButtonColor}`}
                onClick={rollAllEmpty}
              >
                Roll All Empty
              </button>
              <button
                className={`${buttonSharedStyles} ${normalButtonColor}`}
                onClick={sort}
              >
                Sort
              </button>
              <button
                className={`${buttonSharedStyles} ${normalButtonColor}`}
                onClick={() => save()}
                disabled={isSavePending}
              >
                Save
              </button>
            </div>
          </div>

          <Table gridColStyle={tableGridColStyle}>
            <Row>
              <HeadCell />
              <HeadCell>Initiative</HeadCell>
              <HeadCell>Name</HeadCell>
              <HeadCell>HP</HeadCell>
              <HeadCell>AC</HeadCell>
              <HeadCell />
            </Row>
            <DragDropProvider
              onDragEnd={(event) => {
                setInitiativeListItems((prevState) =>
                  move(prevState, event).map((initiativeListItem, index) => ({
                    ...initiativeListItem,
                    sortOrder: index + 1,
                  })),
                );
              }}
            >
              {initiativeListItems.map((initiativeListItem, index) => (
                <DraggableRow
                  gridColStyle={tableGridColStyle}
                  index={index}
                  id={initiativeListItem.id}
                  key={initiativeListItem.id}
                >
                  <InitiativeInputCell
                    index={index}
                    active={initiativeListItem.id === activeId}
                    initiativeListItem={initiativeListItem}
                    changeInitiativeListItemValue={
                      changeInitiativeListItemValue
                    }
                    roll={roll}
                  />
                  <InputCell
                    active={initiativeListItem.id === activeId}
                    value={initiativeListItem.name ?? ""}
                    onChange={(e) =>
                      changeInitiativeListItemValue(index, {
                        name: e.target.value == "" ? null : e.target.value,
                      })
                    }
                  />
                  <InputCell
                    active={initiativeListItem.id === activeId}
                    value={initiativeListItem.hp ?? ""}
                    onChange={(e) =>
                      changeInitiativeListItemValue(index, {
                        hp: parseNumberValue(
                          e.target.value,
                          initiativeListItem.hp,
                        ),
                      })
                    }
                  />
                  <InputCell
                    active={initiativeListItem.id === activeId}
                    value={initiativeListItem.ac ?? ""}
                    onChange={(e) =>
                      changeInitiativeListItemValue(index, {
                        ac: parseNumberValue(
                          e.target.value,
                          initiativeListItem.ac,
                        ),
                      })
                    }
                  />
                  <DeleteCell
                    onClick={() => {
                      if (initiativeListItems.length === 1) return;

                      setInitiativeListItems((prevState) => {
                        const newState = [...prevState];
                        newState.splice(index, 1);
                        return newState;
                      });
                      if (initiativeListItem.id === activeId)
                        setNextItemActive();
                    }}
                  />
                </DraggableRow>
              ))}
            </DragDropProvider>
          </Table>
        </div>
      </main>
      <footer
        className={
          "sticky bottom-0 left-0 right-0 bg-white border-t-2 border-[#ddd] py-8 mt-auto"
        }
      >
        <div
          className={
            "max-w-300 mx-auto flex items-stretch justify-center gap-6"
          }
        >
          <button
            onClick={setPrevItemActive}
            className={`${buttonSharedStyles} ${normalButtonColor}`}
          >
            Prev
          </button>
          <button
            onClick={() =>
              setInitiativeListItems((prevState) => [
                ...prevState,
                createEmptyInitiativeListItem(),
              ])
            }
            className={`${buttonSharedStyles} bg-[#86E265] hover:bg-[#6BDB43]`}
          >
            <FaPlus />
          </button>
          <button
            onClick={setNextItemActive}
            className={`${buttonSharedStyles} ${normalButtonColor}`}
          >
            Next
          </button>
        </div>
      </footer>
    </>
  );
};

import { buttonSharedStyles, normalButtonColor } from "~/shared/components/button/styles";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  type DuplicateInitiativeListRequest,
  useAllInitiativeLists,
  useDuplicateInitiativeList
} from "~/shared/api/initiative-lists";
import { appWidth } from "~/shared/components/layout/styles";
import type {
  Route
} from "../../../../.react-router/types/app/routes/initiative-lists/duplicate/+types/duplicate-initiative-list";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Duplicate Initiative List" },
    {
      name: "description",
      content: "Duplicate an initiative list",
    },
  ];
}

export default function DuplicateInitiativeList() {
  const navigate = useNavigate();
  const [duplicateFormValues, setDuplicateFormValues] =
    useState<DuplicateInitiativeListRequest>({
      id: 0,
      name: "",
    });

  const { data: initiativeLists } = useAllInitiativeLists();
  const { mutate: duplicateInitiativeList } = useDuplicateInitiativeList(
    (data) => navigate(`/initiative-lists/${data.id}`),
  );

  return (
    <main>
      <div className={`${appWidth} mx-auto`}>
        <h1 className={"text-2xl mt-4 mb-2"}>Duplicate Initiative List</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            duplicateInitiativeList(duplicateFormValues);
          }}
        >
          <label className={"block text-xl"}>
            Initiative List to Duplicate
            <select
              className={"block text-xl px-4 py-2 bg-white text-black mt-2"}
              value={duplicateFormValues.id}
              onChange={(e) =>
                setDuplicateFormValues({
                  ...duplicateFormValues,
                  id: Number(e.target.value),
                })
              }
            >
              <option value={0} hidden>
                Select an option...
              </option>
              {initiativeLists?.map((initiativeList, index) => (
                <option key={index} value={initiativeList.id}>
                  {initiativeList.name}
                </option>
              ))}
            </select>
          </label>
          <label className={"block text-xl mt-4"}>
            Name
            <input
              className={"block text-xl px-4 py-2 bg-white text-black mt-2"}
              value={duplicateFormValues.name}
              onChange={(e) =>
                setDuplicateFormValues({
                  ...duplicateFormValues,
                  name: e.target.value,
                })
              }
            />
          </label>
          <input
            className={`${buttonSharedStyles} ${normalButtonColor} mt-4`}
            type={"submit"}
            value={"Duplicate"}
          />
        </form>
      </div>
    </main>
  );
}

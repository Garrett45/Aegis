import type {
  Route
} from "../../../../.react-router/types/app/routes/initiative-lists/add/+types/add-initiative-list-route";
import {buttonSharedStyles, normalButtonColor,} from "~/shared/components/button/styles";
import {useState} from "react";
import {type CreateInitiativeListRequest, useCreateInitiativeList,} from "~/shared/api/initiative-lists";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add Initiative List | Aegis" },
    {
      name: "description",
      content: "This page allows you to create a new initiative list",
    },
  ];
}

export default function AddInitiativeListRoute() {
  const [addFormValues, setAddFormValues] =
    useState<CreateInitiativeListRequest>({
      name: "",
    });
  const { mutate: addInitiativeList } = useCreateInitiativeList();

  return (
    <main className={"px-2"}>
      <div className={`max-w-100 border-2 border-[#ddd] mx-auto px-8 py-4`}>
        <h1 className={"text-2xl mt-4 mb-2"}>Add Initiative List</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addInitiativeList(addFormValues);
          }}
        >
          <label className={"block text-xl"}>
            Name
            <input
              className={
                "block text-xl px-4 py-2 bg-white text-black mt-2 border-2 border-black leading-none w-full"
              }
              value={addFormValues.name}
              onChange={(e) =>
                setAddFormValues({ ...addFormValues, name: e.target.value })
              }
            />
          </label>
          <input
            className={`${buttonSharedStyles} ${normalButtonColor} mt-4`}
            type={"submit"}
            value={"Add"}
          />
        </form>
      </div>
    </main>
  );
}

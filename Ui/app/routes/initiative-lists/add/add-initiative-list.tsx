import type { Route } from "../../../../.react-router/types/app/routes/initiative-lists/add/+types/add-initiative-list";
import { buttonSharedStyles, normalButtonColor } from "~/shared/button/styles";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { InitiativeListBasicResponse } from "~/shared/api/initiative-lists";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add Initiative List" },
    {
      name: "description",
      content: "Create a new initiative list to use",
    },
  ];
}

interface CreateInitiativeListRequest {
  name: string;
}

export default function AddInitiativeList() {
  const navigate = useNavigate();
  const [addFormValues, setAddFormValues] =
    useState<CreateInitiativeListRequest>({
      name: "",
    });

  const addInitiativeList = async () => {
    const initiativeListResponse = await fetch(
      `http://localhost:8080/api/InitiativeLists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addFormValues),
      },
    );
    const initiativeList =
      (await initiativeListResponse.json()) as InitiativeListBasicResponse;
    navigate(`/initiative-lists/${initiativeList.id}`);
  };

  return (
    <main>
      <div className={"max-w-300 mx-auto"}>
        <h1 className={"text-2xl mt-4 mb-2"}>Add Initiative List</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addInitiativeList().catch((error) => console.error(error));
          }}
        >
          <label className={"block text-xl"}>
            Name
            <input
              className={"block text-xl px-4 py-2 bg-white text-black mt-2"}
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

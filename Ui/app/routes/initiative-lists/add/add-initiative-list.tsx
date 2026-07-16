import type { Route } from "../../../../.react-router/types/app/routes/initiative-lists/add/+types/add-initiative-list";
import {
  buttonSharedStyles,
  normalButtonColor,
} from "~/shared/components/button/styles";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  allInitiativeListsQueryKey,
  type InitiativeListBasicResponse,
} from "~/shared/api/initiative-lists";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { appWidth } from "~/shared/components/layout/styles";

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
  const auth = useAuth();

  const navigate = useNavigate();
  const [addFormValues, setAddFormValues] =
    useState<CreateInitiativeListRequest>({
      name: "",
    });

  const queryClient = useQueryClient();
  const { mutate: addInitiativeList } = useMutation({
    mutationFn: async () => {
      const initiativeListResponse = await fetch(
        `http://localhost:8080/api/InitiativeLists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addFormValues),
        },
      );
      return (await initiativeListResponse.json()) as InitiativeListBasicResponse;
    },
    onSuccess: async (data) => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: allInitiativeListsQueryKey(auth),
      });
      navigate(`/initiative-lists/${data.id}`);
    },
  });

  return (
    <main>
      <div className={`${appWidth} mx-auto`}>
        <h1 className={"text-2xl mt-4 mb-2"}>Add Initiative List</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addInitiativeList();
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

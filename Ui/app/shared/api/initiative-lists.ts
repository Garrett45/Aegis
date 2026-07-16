import { type AuthContextProps, useAuth } from "react-oidc-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface CreateInitiativeListRequest {
  name: string;
}

export interface DuplicateInitiativeListRequest {
  id: number;
  name: string;
}

export interface InitiativeListBasicResponse {
  id: number;
  accountId: number;
  name: string;
  round: number;
}

export interface InitiativeListDto {
  id: number;
  accountId: number;
  name: string;
  round: number;
  activeId: string;
  initiativeListItems: InitiativeListItemDto[];
}

export interface InitiativeListItemDto {
  id: string;
  initiative: number | null;
  initiativeBonus: number | null;
  name: string | null;
  hp: number | null;
  ac: number | null;
  sortOrder: number;
}

export const allInitiativeListsQueryKey = (auth: AuthContextProps) => [
  "initiativeLists",
  auth.user?.profile.sub,
];

export function useAllInitiativeLists() {
  const auth = useAuth();

  return useQuery({
    queryKey: allInitiativeListsQueryKey(auth),
    queryFn: async () => {
      const initiativeListResponse = await fetch(
        `http://localhost:8080/api/InitiativeLists`,
        {
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
          },
        },
      );
      return (await initiativeListResponse.json()) as InitiativeListBasicResponse[];
    },
    enabled: auth.isAuthenticated,
  });
}

export function useDuplicateInitiativeList(
  onSuccess?: (data: InitiativeListBasicResponse) => void,
) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DuplicateInitiativeListRequest) => {
      const initiativeListResponse = await fetch(
        `http://localhost:8080/api/InitiativeLists/${request.id}/duplicate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        },
      );
      return (await initiativeListResponse.json()) as InitiativeListBasicResponse;
    },
    onSuccess: async (data) => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: allInitiativeListsQueryKey(auth),
      });
      onSuccess?.(data);
    },
  });
}

export function useDeleteInitiativeList() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await fetch(`http://localhost:8080/api/InitiativeLists/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      });
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: allInitiativeListsQueryKey(auth),
      });
    },
  });
}

import { type AuthContextProps, useAuth } from "react-oidc-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
        `${import.meta.env.VITE_AEGIS_API_BASE_URL}/api/InitiativeLists`,
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

export function useInitiativeList(initiativeListId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["initiativeList", initiativeListId],
    queryFn: async () => {
      const initiativeListResponse = await fetch(
        `${import.meta.env.VITE_AEGIS_API_BASE_URL}/api/InitiativeLists/${initiativeListId}`,
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
}

export function useUpdateInitiativeList() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (initiativeList: InitiativeListDto) => {
      await fetch(
        `${import.meta.env.VITE_AEGIS_API_BASE_URL}/api/InitiativeLists/${initiativeList.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(initiativeList),
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
}

export function useDuplicateInitiativeList(
  onSuccess?: (data: InitiativeListBasicResponse) => void,
) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DuplicateInitiativeListRequest) => {
      const initiativeListResponse = await fetch(
        `${import.meta.env.VITE_AEGIS_API_BASE_URL}/api/InitiativeLists/${request.id}/duplicate`,
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
      await fetch(
        `${import.meta.env.VITE_AEGIS_API_BASE_URL}/api/InitiativeLists/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
          },
        },
      );
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: allInitiativeListsQueryKey(auth),
      });
    },
  });
}

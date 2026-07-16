import type { AuthContextProps } from "react-oidc-context";

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

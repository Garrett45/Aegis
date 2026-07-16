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
  initiativeItems: InitiativeItemDto[];
}

export interface InitiativeItemDto {
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

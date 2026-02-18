export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

export type UserPatch = Partial<Pick<User, "first_name" | "last_name" | "email">>;

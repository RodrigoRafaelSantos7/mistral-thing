export type UserType = {
  id: string;
  name?: string;
  email: string;
  image?: string | null;
};

export type UserContextType = {
  user: UserType | null;
};

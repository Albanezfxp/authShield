import { createContext } from "react";

type AuthContextType = {
  access_token: string | null;
  setAccess_token: (token: string | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

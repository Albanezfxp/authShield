import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
interface AuthProviderProps {
  children: ReactNode;
}
export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{ access_token: accessToken, setAccess_token: setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

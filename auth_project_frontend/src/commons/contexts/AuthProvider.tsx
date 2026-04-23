import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: any) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{ access_token: accessToken, setAccess_token: setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { useState, useMemo, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // ✅ Memoizar o valor do context
  const value = useMemo(
    () => ({
      access_token: accessToken,
      setAccess_token: setAccessToken,
    }),
    [accessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

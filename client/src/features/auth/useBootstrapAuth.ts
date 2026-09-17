import { useAuth } from "@clerk/react";
import { useAuthStore } from "./store";
import { useEffect } from "react";

export function useBootstrapAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { setLoading, setError, clearAuth, setError } = useAuthStore();

  useEffect(() => {
    async function run() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        clearAuth();
      }
    }
    void run();
  }, [isLoaded, isSignedIn, setLoading, setError, clearAuth, setError]);
}

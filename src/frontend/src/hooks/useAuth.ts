import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
    loginStatus,
  } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    clear();
    queryClient.clear();
  };

  const principal = identity?.getPrincipal();
  const principalText = principal?.toString();

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoading: isInitializing || isLoggingIn,
    loginStatus,
    identity,
    principal,
    principalText,
    login: handleLogin,
    logout: handleLogout,
  };
}

import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isWeb } from "@/constants/platform";

type UserState = {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  _hasHydrated: boolean;
  logIn: () => void;
  logOut: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create(
  persist<UserState>(
    (set) => ({
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      _hasHydrated: false,
      logIn: () => {
        set((state: UserState) => {
          return {
            ...state,
            isLoggedIn: true,
          };
        });
      },
      logOut: () => {
        set((state: UserState) => {
          return {
            ...state,
            isLoggedIn: false,
          };
        });
      },
      completeOnboarding: () => {
        set((state: UserState) => {
          return {
            ...state,
            hasCompletedOnboarding: true,
          };
        });
      },
      resetOnboarding: () => {
        set((state: UserState) => {
          return {
            ...state,
            hasCompletedOnboarding: false,
          };
        });
      },
      setHasHydrated: (value: boolean) => {
        set((state: UserState) => {
          return {
            ...state,
            _hasHydrated: value,
          };
        });
      },
    }),
    {
      name: "auth-store",
      storage: isWeb
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => ({
            setItem: (key: string, value: string) =>
              SecureStore.setItemAsync(key, value),
            getItem: (key: string) => SecureStore.getItemAsync(key),
            removeItem: (key: string) => SecureStore.deleteItemAsync(key),
          })),
      onRehydrateStorage: () => {
        return (state: UserState | undefined) => {
          state?.setHasHydrated(true);
        };
      },
    }
  )
);

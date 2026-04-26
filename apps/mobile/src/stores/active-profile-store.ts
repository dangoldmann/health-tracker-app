import { create } from "zustand";

interface ActiveProfileState {
  activeProfileId: string;
  setActiveProfileId: (profileId: string) => void;
}

export const useActiveProfileStore = create<ActiveProfileState>((set) => ({
  activeProfileId: "me",
  setActiveProfileId: (profileId) => set({ activeProfileId: profileId }),
}));

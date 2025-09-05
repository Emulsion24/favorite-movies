import { create } from "zustand";

const useErrorStore = create((set) => ({
  errors: [],
  addError: (msg) =>
    set((state) => ({ errors: [...state.errors, { id: Date.now(), msg }] })),
  clearErrors: () => set({ errors: [] }),
}));

export default useErrorStore;
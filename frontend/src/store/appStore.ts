import { create } from 'zustand'

interface AppState {
    demoMode: boolean
    setDemoMode: (mode: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
    demoMode: true,
    setDemoMode: (mode) => set({ demoMode: mode }),
}))

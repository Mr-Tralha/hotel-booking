import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  fullName: string
  email: string
  phone: string
  cpf: string
}

interface UserState {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  clearProfile: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    { name: 'user-profile' }
  )
)

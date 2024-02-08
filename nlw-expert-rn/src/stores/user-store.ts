import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from '@react-native-async-storage/async-storage'

// AsyncStorage.clear(); // well it's self explanatory

type UserProps = {
    name: string,
    email: string,
    phone: string,
    address: string,
}

type StateProps = {
    user: UserProps,
    save: (user: UserProps) => void
}

export const useUserStore = create(persist<StateProps>((set) => ({
    user : {
        name: '',
        email: '',
        phone: '',
        address: '',
    },

    save: (user: UserProps) =>
        set((state) => (
            { ...state,
                user: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address
                }
            }
        ))
    }
), {
    name: 'nlw-expert:user',
    storage: createJSONStorage(() => AsyncStorage)
}))

import { ProductProps } from '@/utils/data/products'
import { create } from 'zustand'
import * as cartInMemory from './helpers/cart-in-memory'
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from '@react-native-async-storage/async-storage'

// AsyncStorage.clear(); // well it's self explanatory

export type ProductCartProps = ProductProps & {
    quantity: number
}

type StateProps = {
    products: ProductCartProps[],
    add: (product: ProductProps) => void,
    remove: (product: ProductProps) => void,
    clear: () => void
}

export const useCartStore = create(persist<StateProps>((set) => ({
    products: [],

    add: (product: ProductProps) =>
        set((state) => ({
            products: cartInMemory.add(state.products, product),
    })),

    remove: (product: ProductProps) =>
        set((state) => ({
            products: cartInMemory.remove(state.products, product),
    })),

    clear: () => set(() => ({ products: [] })),
}), {
    name: 'nlw-expert:cart',
    storage: createJSONStorage(() => AsyncStorage)
}))

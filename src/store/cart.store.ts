
import { create } from "zustand";
import { Cart, getCart, addCartItem, updateCartItem, removeCartItem, clearCart } from "@/lib/actions/cart";

interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    isOpen: boolean;
    fetchCart: () => Promise<void>;
    addItem: (variantId: string, quantity: number) => Promise<void>;
    updateItem: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clear: () => Promise<void>;
    toggleCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: null,
    isLoading: false,
    isOpen: false,

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            const cart = await getCart();
            set({ cart });
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    addItem: async (variantId: string, quantity: number) => {
        set({ isLoading: true });
        try {
            const cart = await addCartItem(variantId, quantity);
            set({ cart, isOpen: true });
        } catch (error) {
            console.error("Failed to add item to cart:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateItem: async (itemId: string, quantity: number) => {
        set({ isLoading: true });
        try {
            const cart = await updateCartItem(itemId, quantity);
            set({ cart });
        } catch (error) {
            console.error("Failed to update cart item:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    removeItem: async (itemId: string) => {
        set({ isLoading: true });
        try {
            const cart = await removeCartItem(itemId);
            set({ cart });
        } catch (error) {
            console.error("Failed to remove cart item:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    clear: async () => {
        set({ isLoading: true });
        try {
            const cart = await clearCart();
            set({ cart });
        } catch (error) {
            console.error("Failed to clear cart:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));

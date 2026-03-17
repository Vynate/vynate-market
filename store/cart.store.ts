import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartStore } from "@/types";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) =>
            i.vendorProductId === item.vendorProductId &&
            JSON.stringify(i.variantAttributes) === JSON.stringify(item.variantAttributes)
        );

        if (existingIndex > -1) {
          // Update quantity if item exists
          const newItems = [...items];
          const existingItem = newItems[existingIndex]!;
          const newQuantity = existingItem.quantity + item.quantity;
          
          // Check stock limit
          if (newQuantity > item.stockQty) {
            newItems[existingIndex] = {
              ...existingItem,
              quantity: item.stockQty,
            };
          } else {
            newItems[existingIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };
          }
          
          set({ items: newItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            ...item,
            id: `${item.vendorProductId}-${Date.now()}`,
            quantity: Math.min(item.quantity, item.stockQty),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const { items } = get();
        const itemIndex = items.findIndex((item) => item.id === id);
        
        if (itemIndex === -1) return;

        const item = items[itemIndex]!;
        const validQuantity = Math.max(1, Math.min(quantity, item.stockQty));

        const newItems = [...items];
        newItems[itemIndex] = { ...item, quantity: validQuantity };
        set({ items: newItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0
        );
      },

      getItemsByVendor: () => {
        const { items } = get();
        return items.reduce((groups, item) => {
          const vendorId = item.vendorId;
          if (!groups[vendorId]) {
            groups[vendorId] = [];
          }
          groups[vendorId].push(item);
          return groups;
        }, {} as Record<string, CartItem[]>);
      },
    }),
    {
      name: "vynate-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Selectors for optimized re-renders
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartItemCount = () => useCartStore((state) => state.getItemCount());
export const useCartSubtotal = () => useCartStore((state) => state.getSubtotal());
export const useCartItemsByVendor = () => useCartStore((state) => state.getItemsByVendor());

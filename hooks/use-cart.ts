"use client";

import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import type { CartItem } from "@/types";

export function useCart() {
  const store = useCartStore();
  const { addToast } = useUIStore();

  const addToCart = (
    item: Omit<CartItem, "id">,
    options?: { showToast?: boolean; openCart?: boolean }
  ) => {
    const { showToast = true, openCart = false } = options ?? {};

    store.addItem(item);

    if (showToast) {
      addToast({
        type: "success",
        title: "Added to cart",
        message: `${item.productName} has been added to your cart`,
        duration: 3000,
      });
    }

    if (openCart) {
      useUIStore.getState().setCartSidebarOpen(true);
    }
  };

  const removeFromCart = (id: string, productName?: string) => {
    store.removeItem(id);
    addToast({
      type: "info",
      title: "Removed from cart",
      message: productName
        ? `${productName} has been removed from your cart`
        : "Item removed from cart",
      duration: 3000,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    store.updateQuantity(id, quantity);
  };

  const clearCart = () => {
    store.clearCart();
    addToast({
      type: "info",
      title: "Cart cleared",
      message: "All items have been removed from your cart",
      duration: 3000,
    });
  };

  const isInCart = (vendorProductId: string) => {
    return store.items.some((item) => item.vendorProductId === vendorProductId);
  };

  const getItemQuantity = (vendorProductId: string) => {
    const item = store.items.find(
      (item) => item.vendorProductId === vendorProductId
    );
    return item?.quantity ?? 0;
  };

  return {
    items: store.items,
    itemCount: store.getItemCount(),
    subtotal: store.getSubtotal(),
    itemsByVendor: store.getItemsByVendor(),
    isLoading: store.isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
}

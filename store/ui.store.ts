import { create } from "zustand";

interface UIState {
  // Sidebar states
  isMobileSidebarOpen: boolean;
  isCartSidebarOpen: boolean;
  isSearchOpen: boolean;
  isFilterSidebarOpen: boolean;

  // Modal states
  activeModal: string | null;
  modalData: unknown;

  // Loading states
  isPageLoading: boolean;
  loadingMessage: string | null;

  // Toast/notification queue
  toasts: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
    duration?: number;
  }>;

  // Compare products
  compareProducts: string[];

  // Recently viewed
  recentlyViewed: string[];

  // Actions
  setMobileSidebarOpen: (open: boolean) => void;
  setCartSidebarOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setFilterSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;
  setPageLoading: (loading: boolean, message?: string) => void;
  addToast: (toast: Omit<UIState["toasts"][0], "id">) => void;
  removeToast: (id: string) => void;
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  addToRecentlyViewed: (productId: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial states
  isMobileSidebarOpen: false,
  isCartSidebarOpen: false,
  isSearchOpen: false,
  isFilterSidebarOpen: false,
  activeModal: null,
  modalData: null,
  isPageLoading: false,
  loadingMessage: null,
  toasts: [],
  compareProducts: [],
  recentlyViewed: [],

  // Actions
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  
  setCartSidebarOpen: (open) => set({ isCartSidebarOpen: open }),
  
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  
  setFilterSidebarOpen: (open) => set({ isFilterSidebarOpen: open }),

  openModal: (modalId, data) => set({ activeModal: modalId, modalData: data }),
  
  closeModal: () => set({ activeModal: null, modalData: null }),

  setPageLoading: (loading, message) =>
    set({ isPageLoading: loading, loadingMessage: message ?? null }),

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...toast, id };
    
    set({ toasts: [...get().toasts, newToast] });

    // Auto-remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  addToCompare: (productId) => {
    const { compareProducts } = get();
    if (compareProducts.length >= 4) {
      get().addToast({
        type: "warning",
        title: "Compare limit reached",
        message: "You can only compare up to 4 products",
      });
      return;
    }
    if (!compareProducts.includes(productId)) {
      set({ compareProducts: [...compareProducts, productId] });
    }
  },

  removeFromCompare: (productId) => {
    set({
      compareProducts: get().compareProducts.filter((id) => id !== productId),
    });
  },

  clearCompare: () => set({ compareProducts: [] }),

  addToRecentlyViewed: (productId) => {
    const { recentlyViewed } = get();
    const filtered = recentlyViewed.filter((id) => id !== productId);
    const updated = [productId, ...filtered].slice(0, 20); // Keep last 20
    set({ recentlyViewed: updated });
  },
}));

// Selectors
export const useIsMobileSidebarOpen = () =>
  useUIStore((state) => state.isMobileSidebarOpen);
export const useIsCartSidebarOpen = () =>
  useUIStore((state) => state.isCartSidebarOpen);
export const useIsSearchOpen = () => useUIStore((state) => state.isSearchOpen);
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useModalData = () => useUIStore((state) => state.modalData);
export const useToasts = () => useUIStore((state) => state.toasts);
export const useCompareProducts = () =>
  useUIStore((state) => state.compareProducts);
export const useRecentlyViewed = () =>
  useUIStore((state) => state.recentlyViewed);

import { create } from 'zustand';

export const useAuthStore = create((set) => {
  // Initialize state from localStorage
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    isAuthenticated: !!savedToken,

    login: (userData, tokenValue) => {
      localStorage.setItem('token', tokenValue);
      localStorage.setItem('user', JSON.stringify(userData));
      set({
        user: userData,
        token: tokenValue,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      // Redirect to login if needed, or let the router handle it
    },

    updateUserProfile: (profileData) => {
      set((state) => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { user: updatedUser };
      });
    },
    updateUserAddress: (newAddress) => {
      set((state) => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, address: newAddress };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { user: updatedUser };
      });
    }
  };
});

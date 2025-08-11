import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface Favorite {
    _id: string;
    product: Product;
}

interface FavoritesState {
    items: Favorite[];
    isOpen: boolean;
}

type FavoritesAction =
    | { type: 'SET_FAVORITES'; items: Favorite[] }
    | { type: 'ADD_TO_FAVORITES'; product: Product; favoriteId?: string }
    | { type: 'REMOVE_FROM_FAVORITES'; favoriteId: string }
    | { type: 'CLEAR_FAVORITES' }
    | { type: 'TOGGLE_FAVORITES' }
    | { type: 'CLOSE_FAVORITES' };

const FavoritesContext = createContext<{
    state: FavoritesState;
    dispatch: React.Dispatch<FavoritesAction>;
    totalFavorites: number;
} | null>(null);

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
    switch (action.type) {
        case 'SET_FAVORITES':
            return { ...state, items: action.items };

        case 'ADD_TO_FAVORITES': {
            const exists = state.items.some(fav => fav.product._id === action.product._id);
            if (exists) return state; // Prevent duplicates
            return {
                ...state,
                items: [
                    ...state.items,
                    { _id: action.favoriteId || `temp-${action.product._id}`, product: action.product }
                ]
            };
        }

        case 'REMOVE_FROM_FAVORITES':
            return {
                ...state,
                items: state.items.filter(f => f._id !== action.favoriteId)
            };

        case 'CLEAR_FAVORITES':
            return { ...state, items: [] };

        case 'TOGGLE_FAVORITES':
            return { ...state, isOpen: !state.isOpen };

        case 'CLOSE_FAVORITES':
            return { ...state, isOpen: false };

        default:
            return state;
    }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const { state: authState } = useAuth();
    const [state, dispatch] = useReducer(favoritesReducer, {
        items: [],
        isOpen: false,
    });

    // Load favorites on auth change
    useEffect(() => {
        const fetchData = async () => {
            try {
                const favorites = await api.getFavorites();
                dispatch({ type: 'SET_FAVORITES', items: favorites });
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            }
        };

        if (authState.isAuthenticated) {
            fetchData();
        } else {
            const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
            dispatch({ type: 'SET_FAVORITES', items: guestFavorites });
        }
    }, [authState.isAuthenticated]);

    // Save guest favorites to localStorage
    useEffect(() => {
        if (!authState.isAuthenticated) {
            localStorage.setItem('guestFavorites', JSON.stringify(state.items));
        }
    }, [state.items, authState.isAuthenticated]);

    // Merge guest favorites into backend on login
    useEffect(() => {
        const mergeGuestFavorites = async () => {
            const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
            if (guestFavorites.length) {
                for (const fav of guestFavorites) {
                    await api.addToFavorites(fav.product._id);
                }
                localStorage.removeItem('guestFavorites');
            }
        };
        if (authState.isAuthenticated) {
            mergeGuestFavorites();
        }
    }, [authState.isAuthenticated]);

    // Sync functions
    const syncAddToFavorites = async (product: Product) => {
        if (!authState.isAuthenticated) {
            dispatch({ type: 'ADD_TO_FAVORITES', product });
            return;
        }
        try {
            const newFav = await api.addToFavorites(product._id);
            dispatch({ type: 'ADD_TO_FAVORITES', product, favoriteId: newFav._id });
        } catch (error) {
            console.error("Failed to add to favorites:", error);
        }
    };

    const syncRemoveFromFavorites = async (favoriteId: string) => {
        if (!authState.isAuthenticated) {
            dispatch({ type: 'REMOVE_FROM_FAVORITES', favoriteId });
            return;
        }
        try {
            await api.removeFromFavorites(favoriteId);
            dispatch({ type: 'REMOVE_FROM_FAVORITES', favoriteId });
        } catch (error) {
            console.error("Failed to remove from favorites:", error);
        }
    };



    const enhancedDispatch = (action: FavoritesAction) => {
        switch (action.type) {
            case 'ADD_TO_FAVORITES':
                syncAddToFavorites(action.product);
                break;
            case 'REMOVE_FROM_FAVORITES':
                syncRemoveFromFavorites(action.favoriteId);
                break;

            default:
                dispatch(action);
        }
    };

    const totalFavorites = state.items.length;

    return (
        <FavoritesContext.Provider value={{ state, dispatch: enhancedDispatch, totalFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
    return context;
}

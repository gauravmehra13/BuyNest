import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import { favoritesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { FavoriteItem } from '../types';

interface FavoritesState {
    items: FavoriteItem[];
    isOpen: boolean;
}

type FavoritesAction =
    | { type: 'SET_FAVORITES'; items: FavoriteItem[] }
    | { type: 'ADD_TO_FAVORITES'; product: Product; favoriteId?: string }
    | { type: 'REMOVE_FROM_FAVORITES'; favoriteId: string }
    | { type: 'CLEAR_FAVORITES' }
    | { type: 'TOGGLE_FAVORITES' }
    | { type: 'CLOSE_FAVORITES' };

export const FavoritesContext = createContext<{
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
            if (exists) return state;
            return {
                ...state,
                items: [
                    ...state.items,
                    { 
                        _id: action.favoriteId || `temp-${action.product._id}`, 
                        product: action.product,
                        user: '', // Optional, so no need to include if not used
                        createdAt: new Date().toISOString(), // Optional
                        updatedAt: new Date().toISOString(), // Optional
                    }
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const favorites = await favoritesAPI.getFavorites() as FavoriteItem[];
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

    useEffect(() => {
        if (!authState.isAuthenticated) {
            localStorage.setItem('guestFavorites', JSON.stringify(state.items));
        }
    }, [state.items, authState.isAuthenticated]);

    useEffect(() => {
        const mergeGuestFavorites = async () => {
            const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
            if (guestFavorites.length) {
                for (const fav of guestFavorites) {
                    await favoritesAPI.addToFavorites(fav.product._id);
                }
                localStorage.removeItem('guestFavorites');
                const updatedFavorites = await favoritesAPI.getFavorites() as FavoriteItem[];
                dispatch({ type: 'SET_FAVORITES', items: updatedFavorites });
            }
        };
        if (authState.isAuthenticated) {
            mergeGuestFavorites();
        }
    }, [authState.isAuthenticated]);

    const syncAddToFavorites = async (product: Product) => {
        if (!authState.isAuthenticated) {
            dispatch({ type: 'ADD_TO_FAVORITES', product });
            toast.success('Added to favorites!', { id: 'add-to-favorites' });
            return;
        }
        try {
            const newFav = await favoritesAPI.addToFavorites(product._id) as { _id: string };
            dispatch({ type: 'ADD_TO_FAVORITES', product, favoriteId: newFav._id });
            toast.success('Added to favorites!', { id: 'add-to-favorites' });
        } catch (error) {
            console.error("Failed to add to favorites:", error);
            toast.error('Failed to add to favorites', { id: 'add-to-favorites' });
        }
    };

    const syncRemoveFromFavorites = async (favoriteId: string) => {
        if (!authState.isAuthenticated) {
            dispatch({ type: 'REMOVE_FROM_FAVORITES', favoriteId });
            toast.success('Removed from favorites!');
            return;
        }
        try {
            await favoritesAPI.removeFromFavorites(favoriteId);
            dispatch({ type: 'REMOVE_FROM_FAVORITES', favoriteId });
            toast.success('Removed from favorites!');
        } catch (error) {
            console.error("Failed to remove from favorites:", error);
            toast.error('Failed to remove from favorites');
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
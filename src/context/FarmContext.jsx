// src/context/FarmContext.jsx
import { createContext, useReducer } from 'react';

export const FarmContext = createContext();

const initialState = {
  batch: null,
  feed: [],
  weights: [],
  mortality: [],
  toast: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_BATCH':
      return { ...state, batch: action.payload };
    case 'ADD_FEED':
      return { ...state, feed: [...state.feed, action.payload] };
    case 'ADD_WEIGHT':
      return { ...state, weights: [...state.weights, action.payload] };
    case 'ADD_MORTALITY':
      return { ...state, mortality: [...state.mortality, action.payload] };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

export function FarmProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <FarmContext.Provider value={{ state, dispatch }}>
      {children}
    </FarmContext.Provider>
  );
}

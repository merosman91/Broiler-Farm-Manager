// FarmContext.js - أنشئ هذا الملف
import React, { createContext, useContext, useReducer } from 'react'

const FarmContext = createContext()

const initialState = {
  batches: []
}

function farmReducer(state, action) {
  switch (action.type) {
    case 'ADD_BATCH':
      return {
        ...state,
        batches: [...state.batches, action.payload]
      }
    case 'UPDATE_BATCH':
      return {
        ...state,
        batches: state.batches.map(b =>
          b.id === action.payload.id ? action.payload : b
        )
      }
    default:
      return state
  }
}

export function FarmProvider({ children }) {
  const [state, dispatch] = useReducer(farmReducer, initialState)
  
  return (
    <FarmContext.Provider value={{ state, dispatch }}>
      {children}
    </FarmContext.Provider>
  )
}

export function useFarm() {
  const context = useContext(FarmContext)
  if (!context) {
    throw new Error('useFarm must be used within FarmProvider')
  }
  return context
}

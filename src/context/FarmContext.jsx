import React, { createContext, useReducer, useContext } from 'react'

export const FarmContext = createContext()

const initialState = {
  batches: [],
  activeBatchId: null,
  records: [],
  toast: null,
  modals: {
    feed: false,
    weight: false,
    mortality: false,
    batch: false
  }
}

function farmReducer(state, action) {
  switch (action.type) {
    case 'SET_BATCHES':
      return { ...state, batches: action.payload }
    
    case 'SET_ACTIVE_BATCH':
      return { ...state, activeBatchId: action.payload }
    
    case 'SET_RECORDS':
      return { ...state, records: action.payload }
    
    case 'ADD_BATCH':
      return { 
        ...state, 
        batches: [action.payload, ...state.batches],
        activeBatchId: action.payload.id
      }
    
    case 'UPDATE_BATCH':
      return {
        ...state,
        batches: state.batches.map(b => 
          b.id === action.payload.id ? action.payload : b
        )
      }
    
    case 'ADD_RECORD':
      return {
        ...state,
        records: [...state.records, action.payload]
      }
    
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload }
    
    case 'HIDE_TOAST':
      return { ...state, toast: null }
    
    case 'SHOW_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.payload]: true }
      }
    
    case 'HIDE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.payload]: false }
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
    throw new Error('useFarm must be used within a FarmProvider')
  }
  return context
                                   } 

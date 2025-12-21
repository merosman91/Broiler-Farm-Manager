// src/context/FarmContext.jsx
import React, { createContext, useContext, useReducer } from 'react'

const FarmContext = createContext()

// الدالة لتحميل من localStorage
function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('farm_batches')
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return []
  }
}

// الدالة للحفظ في localStorage
function saveToLocalStorage(batches) {
  try {
    localStorage.setItem('farm_batches', JSON.stringify(batches))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// الحالة الابتدائية
const initialState = {
  batches: loadFromLocalStorage()
}

// الـ reducer
function farmReducer(state, action) {
  let newState
  
  switch (action.type) {
    case 'ADD_BATCH':
      newState = {
        ...state,
        batches: [...state.batches, action.payload]
      }
      break
      
    case 'UPDATE_BATCH':
      newState = {
        ...state,
        batches: state.batches.map(batch =>
          batch.id === action.payload.id ? action.payload : batch
        )
      }
      break
      
    case 'DELETE_BATCH':
      newState = {
        ...state,
        batches: state.batches.filter(batch => batch.id !== action.payload)
      }
      break
      
    case 'SET_BATCHES':
      newState = {
        ...state,
        batches: action.payload
      }
      break
      
    default:
      return state
  }
  
  // حفظ في localStorage
  saveToLocalStorage(newState.batches)
  return newState
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

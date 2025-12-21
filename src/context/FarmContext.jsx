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
// أضف هذه الدوال في FarmContext.js
function saveToLocalStorage(batches) {
  try {
    localStorage.setItem('farm_batches', JSON.stringify(batches))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('farm_batches')
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return []
  }
}

// ثم عدل initialState
const initialState = {
  batches: loadFromLocalStorage() // تحميل من التخزين المحلي
}

// وأضف حفظ بعد كل تحديث
function farmReducer(state, action) {
  let newState
  switch (action.type) {
    case 'ADD_BATCH':
      newState = {
        ...state,
        batches: [...state.batches, action.payload]
      }
      break
    // ... بقية الحالات
    default:
      return state
  }
  
  // حفظ في localStorage بعد كل تحديث
  saveToLocalStorage(newState.batches)
  return newState
        }

"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, AlertCircle, HelpCircle } from 'lucide-react'

interface AlertModalConfig {
  message: string
  type: 'alert' | 'confirm'
  onConfirm?: () => void
  onCancel?: () => void
}

interface AlertModalContextType {
  alert: (message: string) => void
  confirm: (message: string) => Promise<boolean>
}

const AlertModalContext = createContext<AlertModalContextType | undefined>(undefined)

export const useAlertModal = () => {
  const context = useContext(AlertModalContext)
  if (!context) {
    throw new Error('useAlertModal must be used within an AlertModalProvider')
  }
  return context
}

interface AlertModalProviderProps {
  children: ReactNode
}

export const AlertModalProvider: React.FC<AlertModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<AlertModalConfig>({
    message: '',
    type: 'alert'
  })

  const alert = useCallback((message: string) => {
    setConfig({
      message,
      type: 'alert'
    })
    setIsOpen(true)
  }, [])

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig({
        message,
        type: 'confirm',
        onConfirm: () => {
          setIsOpen(false)
          resolve(true)
        },
        onCancel: () => {
          setIsOpen(false)
          resolve(false)
        }
      })
      setIsOpen(true)
    })
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    if (config.onCancel) {
      config.onCancel()
    }
  }

  const handleConfirm = () => {
    if (config.onConfirm) {
      config.onConfirm()
    } else {
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel()
    } else {
      setIsOpen(false)
    }
  }

  // Prevent closing on backdrop click for alerts/confirms (like browser behavior)
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <AlertModalContext.Provider value={{ alert, confirm }}>
      {children}
      
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-60"
            onClick={handleBackdropClick}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-2xl max-w-sm w-full mx-4 transform">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {config.type === 'confirm' ? (
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                )}
                <h3 className="text-lg font-medium text-gray-900">
                  {config.type === 'confirm' ? 'Confirm' : 'Alert'}
                </h3>
              </div>
            </div>
            
            {/* Body */}
            <div className="px-6 py-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {config.message}
              </p>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
              <div className="flex gap-3 justify-end">
                {config.type === 'confirm' ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium min-w-[80px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium min-w-[80px]"
                    >
                      OK
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium min-w-[80px]"
                  >
                    OK
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AlertModalContext.Provider>
  )
}

// Global replacement functions
let globalAlertModal: AlertModalContextType | null = null

export const setGlobalAlertModal = (modal: AlertModalContextType) => {
  globalAlertModal = modal
}

// Override browser alert and confirm
export const overrideBrowserDialogs = () => {
  if (typeof window !== 'undefined' && globalAlertModal) {
    // Store original functions in case we need them
    const originalAlert = window.alert
    const originalConfirm = window.confirm
    
    // Override with our custom modal
    window.alert = (message?: any) => {
      globalAlertModal!.alert(String(message || ''))
    }
    
    // For confirm, we need to make it synchronous-looking but it's actually async
    // This is a limitation - we can't make it truly synchronous like browser confirm
    window.confirm = (message?: any) => {
      console.warn('window.confirm is now async. Use modal.confirm() directly for better control.')
      globalAlertModal!.confirm(String(message || ''))
      return false // Default return for compatibility
    }
    
    // Return cleanup function
    return () => {
      window.alert = originalAlert
      window.confirm = originalConfirm
    }
  }
  return () => {}
}

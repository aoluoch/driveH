import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface FavouritesContextValue {
  favourites: string[]
  toggle: (id: string) => void
  isFavourite: (id: string) => boolean
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null)

function storageKey(userId: string | undefined) {
  return userId ? `dh_favourites_${userId}` : 'dh_favourites_guest'
}

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const key = storageKey(user?.$id)

  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey(user?.$id)) ?? '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavourites(JSON.parse(localStorage.getItem(key) ?? '[]'))
    } catch {
      setFavourites([])
    }
  }, [key])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(favourites))
  }, [favourites, key])

  function toggle(id: string) {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  function isFavourite(id: string) {
    return favourites.includes(id)
  }

  return (
    <FavouritesContext.Provider value={{ favourites, toggle, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavourites() {
  const ctx = useContext(FavouritesContext)
  if (!ctx) throw new Error('useFavourites must be used inside FavouritesProvider')
  return ctx
}

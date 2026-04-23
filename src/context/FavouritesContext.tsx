import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface FavouritesContextValue {
  favourites: string[]
  toggle: (id: string) => void
  isFavourite: (id: string) => boolean
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null)

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dh_favourites') ?? '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('dh_favourites', JSON.stringify(favourites))
  }, [favourites])

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

export function useFavourites() {
  const ctx = useContext(FavouritesContext)
  if (!ctx) throw new Error('useFavourites must be used inside FavouritesProvider')
  return ctx
}

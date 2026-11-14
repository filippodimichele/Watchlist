
export type Show = {
    id: number
    title: string
    year: number
    kind: "film" | "serie"
    watched: boolean
    rating?: number // 1-5, undefined = nessun voto
}

export const watchlist: Show[] = [
    { id: 1, title: "Il Signore degli Anelli", year: 2001, kind: "film", watched: true, rating: 5 },
    { id: 2, title: "Game of Thrones", year: 2011, kind: "serie", watched: true, rating: 5 },
    { id: 3, title: "Pulp Fiction", year: 1994, kind: "film", watched: false },
    { id: 4, title: "Breaking Bad", year: 2008, kind: "serie", watched: true, rating: 5 },
    { id: 5, title: "Titanic", year: 1997, kind: "film", watched: true, rating: 4 },
    { id: 6, title: "Profondo rosso", year: 1975, kind: "film", watched: false },
]

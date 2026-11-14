export type Show = {
    id: number
    title: string
    year: number
    kind: "film" | "serie"
}

export const watchlist: Show[] = [
    { id: 1, title: "Inception", year: 2010, kind: 'film' },
    { id: 2, title: "Stranger Things", year: 2016, kind: 'serie' },
    { id: 3, title: "Interstellar", year: 2014, kind: 'film' },
    { id: 4, title: "Mare fuori", year: 2020, kind: 'serie' },
    { id: 5, title: "Oppenheimer", year: 2023, kind: 'film' },
    { id: 6, title: "La compagnia dell'anello", year: 2001, kind: 'film' },
]

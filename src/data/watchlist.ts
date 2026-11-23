export type Show = {
    id: string
    title: string
    year: number
    kind: "film" | "serie"
    watched : boolean
    rating: number | null

}

export const watchlist: Show[] = [
    {
        id: "1",
        title: "Inception",
        year: 2010,
        kind: "film",
        watched: false,
        rating: null
    },
    {
        id: "2",
        title: "Stranger Things",
        year: 2016,
        kind: "serie",
        watched: false,
        rating: null
    },
    {
        id: "3",
        title: "Interstellar",
        year: 2014,
        watched: false,
        rating: null,
        kind: 'film'
    },
    {
        id: "4",
        title: "Mare fuori",
        year: 2020,
        kind: 'serie',
        watched: false,
        rating: null
    },

    {
        id: "5",
        title: "Oppenheimer",
        year: 2023,
        kind: 'film',
        watched: false,
        rating: null
    },

    {
        id: "6",
        title: "La compagnia dell'anello",
        year: 2001,
        kind: 'film',
        watched: false,
        rating: null
    },

]

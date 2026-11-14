
import { useState } from "react";
import { ShowRow } from "./components/ShowRow";
import { Button } from "./components/Button";
import AddShowForm from "./components/AddShowForm";
import { watchlist as initialWatchList, type Show } from "./data/watchlist";

type Filter = "tutti" | "serie" | "film";

function App() {
  const [nextWatch, setNextWatch] = useState<Show>();
  const [activeFilter, setActiveFilter] = useState<Filter>("tutti");
  const [watchlist, setWatchlist] = useState(initialWatchList);

  function handleShowClick(show: Show) {
    if (nextWatch?.id === show.id) {
      setNextWatch(undefined);
    } else {
      setNextWatch(show);
    }
  }

  function handleAddShow(newShow: Omit<Show, "id">) {
    setWatchlist(prev => [
      ...prev,
      {
        ...newShow,
        id: Math.max(0, ...prev.map(show => show.id)) + 1
      }
    ]);
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center p-12">

        <h1 className="font-bold text-4xl text-center">
          La mia watchlist
        </h1>

        <div className="flex gap-4 mt-4">
          {(["tutti", "serie", "film"] as const).map(filtro => (
            <Button
              key={filtro}
              variant={activeFilter === filtro ? "active" : "default"}
              onClick={() => setActiveFilter(filtro)}
            >
              {filtro}
            </Button>
          ))}
        </div>

        <div className="w-xl flex flex-col gap-4 py-4">
          {watchlist
            .filter(show =>
              activeFilter === "tutti" ||
              show.kind === activeFilter
            )
            .map(show => (
              <ShowRow
                onClick={() => handleShowClick(show)}
                show={show}
                isSelected={nextWatch?.id === show.id}
                key={show.id}
              />
            ))}
        </div>

        <p>
          {watchlist.length} titoli:
          {" "}
          {watchlist.filter(show => show.kind === "film").length} film
          e
          {" "}
          {watchlist.filter(show => show.kind === "serie").length} serie
        </p>

        {nextWatch && (
          <p className="font-bold">
            Stasera guardo:
            {" "}
            <span className="capitalize">
              {nextWatch.title}
            </span>
          </p>
        )}

        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-center text-xl">
            Aggiungi Titolo
          </h2>

          <AddShowForm onSubmit={handleAddShow} />
        </div>

      </div>
    </>
  );
}

export default App;

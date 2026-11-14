
import { useState } from "react";
import { ShowRow } from "./components/ShowRow";
import { Button } from "./components/Button";
import AddShowForm from "./components/AddShowForm";
import { watchlist as initialWatchList, type Show } from "./data/watchlist";

type Filter = "tutti" | "serie" | "film";
type ShowFormValues = Pick<Show, "title" | "year" | "kind">;

function App() {
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("tutti");
  const [watchlist, setWatchlist] = useState(initialWatchList);
  const [editingId, setEditingId] = useState<number>();

  const editingShow = watchlist.find(show => show.id === editingId);

  const selectedShow = watchlist.find(
    show => show.id === selectedShowId
  );

  function handleShowClick(id: number) {
    setSelectedShowId(prev => prev === id ? null : id);
  }

  function handleAddShow(newShow: ShowFormValues) {
    setWatchlist(prev => [
      ...prev,
      {
        ...newShow,
        id: Math.max(0, ...prev.map(show => show.id)) + 1,
        watched: false,
        rating: undefined,
      }
    ]);
  }

  function handleSaveShow(id: number, data: ShowFormValues) {
    setWatchlist(prev =>
      prev.map(show => (show.id === id ? { ...show, ...data } : show))
    );
    setEditingId(undefined);
  }

  function handleToggleWatched(id: number) {
    setWatchlist(prev =>
      prev.map(show =>
        show.id === id ? { ...show, watched: !show.watched } : show
      )
    );
  }

  function handleRate(id: number, rating: number | undefined) {
    setWatchlist(prev =>
      prev.map(show => (show.id === id ? { ...show, rating } : show))
    );
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
                key={show.id}
                show={show}
                isSelected={selectedShowId === show.id}
                onClick={() => handleShowClick(show.id)}
                onToggleWatched={() => handleToggleWatched(show.id)}
                onRate={(rating) => handleRate(show.id, rating)}
                onEdit={() => setEditingId(show.id)}
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

        {selectedShow && (
          <p className="font-bold">
            Stasera guardo:
            {" "}
            <span className="capitalize">
              {selectedShow.title}
            </span>
          </p>
        )}

        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-center text-xl">
            {editingShow ? "Modifica titolo" : "Aggiungi Titolo"}
          </h2>

          <AddShowForm
            key={editingId ?? "new"}
            existingTitles={watchlist.map(show => ({
              id: show.id,
              title: show.title
            }))}
            editingShow={editingShow}
            onAdd={handleAddShow}
            onSave={handleSaveShow}
            onCancelEdit={() => setEditingId(undefined)}
          />
        </div>

      </div>
    </>
  );
}

export default App;

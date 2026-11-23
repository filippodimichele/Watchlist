
import { useEffect, useState } from "react";
import { ShowRow } from "./components/ShowRow";
import { Button } from "./components/Button";
import AddShowForm from "./components/AddShowForm";
import { type Show } from "./data/watchlist";
import { env } from "./utils/env";
import AddShowFormV2 from "./components/AddShowFormV2";


type Filter = "tutti" | "serie" | "film";

function App() {
  const [nextWatch, setNextWatch] = useState<Show>();
  const [activeFilter, setActiveFilter] = useState<Filter>("tutti");
  const [watchlist, setWatchlist] = useState<Show[]>([]);
  const [editingShow, setEditingShow] = useState<Show | null>(null);

  useEffect(() => {

    fetch(env.backendUrl + "/watchlist")
      .then(res => res.json())
      .then(data => {
        setWatchlist(data);
      });
  }, []);

  function handleEditShow(show: Show) {
    setEditingShow(show);

  }


  function handleShowClick(show: Show) {
    if (nextWatch?.id === show.id) {
      setNextWatch(undefined);
    } else {
      setNextWatch(show);
    }
  }


  async function handleAddShow(newShow: Omit<Show, "id">) {

    const res = await fetch(env.backendUrl + "/watchlist", {
      method: "POST",
      body: JSON.stringify(newShow),
      headers: {
        "Content-Type": "application/json"
      },
    });


    if (!res.ok) {
      throw new Error("Errore durante l'aggiunta del titolo");
    }

    const createdShow: Show = await res.json();

    setWatchlist(prev => [
      ...prev,
      createdShow]);

  }



  async function handleDeleteShow(id: string) {
    const res = await fetch(env.backendUrl + "/watchlist/" + id, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Errore durante l'eliminazione del titolo");
    }

    setWatchlist(prev => prev.filter(show => show.id !== id));

    setNextWatch(prev => prev?.id === id ? undefined : prev);

    setEditingShow(prev => prev?.id === id ? null : prev);
  }


  //UPDATE

  async function handleUpdateShow(updatedShow: Omit<Show, "id">) {
    if (!editingShow) return;

    const res = await fetch(env.backendUrl + "/watchlist/" + editingShow.id, {
      method: "PUT",
      body: JSON.stringify({
        ...updatedShow,
        id: editingShow.id
      }),
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!res.ok) {
      throw new Error("Errore durante la modifica del titolo");
    }

    const savedShow: Show = await res.json();

    setWatchlist(prev =>
      prev.map(show =>
        show.id === savedShow.id ? savedShow : show
      )
    );

    setEditingShow(null);
  }

  async function handleToggleWatched(show: Show) {
    const updatedShow = {
      ...show,
      watched: !show.watched,
    };

    const res = await fetch(env.backendUrl + "/watchlist/" + show.id, {
      method: "PUT",
      body: JSON.stringify(updatedShow),
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!res.ok) {
      throw new Error("Errore durante l'aggiornamento dello stato di visione");
    }

    const savedShow: Show = await res.json();

    setWatchlist(prev =>
      prev.map(item =>
        item.id === savedShow.id ? savedShow : item
      )
    );

    setNextWatch(prev =>
      prev?.id === savedShow.id ? savedShow : prev
    );
  }


  async function handleRateShow(show: Show, rating: number | null) {
    const updatedShow = {
      ...show,
      rating: rating,
    };

    const res = await fetch(env.backendUrl + "/watchlist/" + show.id, {
      method: "PUT",
      body: JSON.stringify(updatedShow),
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!res.ok) {
      throw new Error("Errore durante l'aggiornamento della valutazione");
    }

    const savedShow: Show = await res.json();

    setWatchlist(prev =>
      prev.map(item =>
        item.id === savedShow.id ? savedShow : item
      )
    );

    setNextWatch(prev =>
      prev?.id === savedShow.id ? savedShow : prev
    );

    setEditingShow(prev =>
      prev?.id === savedShow.id ? savedShow : prev
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
                onClick={() => handleShowClick(show)}
                onEdit={() => handleEditShow(show)}
                onDelete={() => handleDeleteShow(show.id)}
                show={show}
                isSelected={nextWatch?.id === show.id}
                key={show.id}
                onToggleWatched={() => handleToggleWatched(show)}
                onRate={(rating) => handleRateShow(show, rating)}
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
            {editingShow ? "Modifica titolo" : "Aggiungi titolo"}
          </h2>

          {editingShow ? (
            <AddShowFormV2
              defaultValues={editingShow}
              onSubmit={handleUpdateShow}
              onCancel={() => setEditingShow(null)}
              existingShows={watchlist}
            />
          ) : (
            <AddShowForm
            existingShows={watchlist}
             onSubmit={handleAddShow} />
          )}

        </div>

      </div>
    </>
  );
}

export default App;

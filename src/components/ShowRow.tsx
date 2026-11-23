
import type { Show } from "../data/watchlist";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { useState } from "react";
import { MorphIcon } from "morphicons/react";
import { Trash, Check, SquarePen } from "lucide";


type ShowRowProps = {
    show: Show,
    isSelected: boolean,
    onClick: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggleWatched: () => void;
    onRate: (rating: number | null) => void;
};

export function ShowRow({ show, isSelected, onClick, onEdit, onDelete, onToggleWatched, onRate }: ShowRowProps) {
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            className={cn(
                "flex justify-between items-center px-4 py-2 border border-gray-400 rounded-lg cursor-pointer",
                {
                    "border-blue-500 border-2 bg-blue-50": isSelected,
                }
            )}
        >
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={show.watched}
                        onChange={onToggleWatched}
                        onClick={(e) => e.stopPropagation()}
                        className="accent-indigo-600 cursor-pointer"
                    />


                    <p className={cn("font-bold capitalize", {
                        "line-through text-gray-600": show.watched,
                    })}>

                        {show.title}
                    </p>
                </div>
                <p className="opacity-75">{show.year}</p>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(rating => (
                        <button
                            key={rating}
                            type="button"
                            aria-label={`Vota ${rating} su 5`}
                            title={`Vota ${rating} su 5`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRate(show.rating === rating ? null : rating);
                            }}
                            className={cn(
                                "text-xl transition-colors",
                                rating <= (show.rating ?? 0)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                            )}
                        >
                            {rating <= (show.rating ?? 0) ? "★" : "☆"}
                        </button>
                    ))}
                </div>
            </div>

            <span className={cn("rounded-full text-center px-3 text-black/90 capitalize", {
                "bg-yellow-200": show.kind === 'film',
                "bg-purple-200": show.kind === 'serie',
            })}>{show.kind}</span>

            <div className="flex gap-2">
                <div
                    onMouseEnter={() => setIsDeleteHovered(true)}
                    onMouseLeave={() => setIsDeleteHovered(false)}
                >
                    <Button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <span className="flex items-center gap-2">
                            <MorphIcon
                                icon={isDeleteHovered ? Check : Trash}
                                size={18}
                                spring="snappy"
                                reducedMotion="never"
                            />
                            Elimina
                        </span>
                    </Button>
                </div>

                <Button
                    type="button"
                    className="bg-slate-600 hover:bg-slate-700 text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                >
                    <span className="flex items-center gap-2">
                        <MorphIcon icon={SquarePen} size={18} />
                        Modifica
                    </span>
                </Button>
            </div>
        </div>
    );
}

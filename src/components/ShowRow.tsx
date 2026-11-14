import type { Show } from "../data/watchlist";
import { cn } from "../utils/cn";
import { Button } from "./Button";

const STARS = [1, 2, 3, 4, 5] as const;

type ShowRowProps = {
    show: Show;
    isSelected: boolean;
    onClick: () => void;
    onToggleWatched: () => void;
    onRate: (rating: number | undefined) => void;
    onEdit: () => void;
};

export function ShowRow({ show, isSelected, onClick, onToggleWatched, onRate, onEdit }: ShowRowProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex justify-between items-center gap-4 px-4 py-2 border border-gray-400 rounded-lg cursor-pointer",
                { "border-blue-500 border-2 bg-blue-50": isSelected }
            )}
        >
            <input
                type="checkbox"
                checked={show.watched}
                onClick={(e) => e.stopPropagation()}
                onChange={onToggleWatched}
                title="Visto"
            />

            <div className="flex flex-col flex-1">
                <p className={cn("font-bold capitalize", { "line-through opacity-50": show.watched })}>
                    {show.title}
                </p>
                <p className="opacity-75">{show.year}</p>
            </div>

            <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                {STARS.map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRate(star === show.rating ? undefined : star)}
                        className={cn(
                            "text-xl leading-none",
                            star <= (show.rating ?? 0) ? "text-yellow-400" : "text-gray-300"
                        )}
                    >
                        ★
                    </button>
                ))}
            </div>

            <span className={cn("rounded-full text-center px-3 text-black/90 capitalize", {
                "bg-yellow-200": show.kind === 'film',
                "bg-purple-200": show.kind === 'serie',
            })}>{show.kind}</span>

            <Button
                type="button"
                variant="default"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                }}
            >
                Modifica
            </Button>
        </div>
    );
}

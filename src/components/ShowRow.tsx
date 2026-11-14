import type { Show } from "../data/watchlist";
import { cn } from "../utils/cn";

type ShowRowProps = {
    show: Show,
    isSelected: boolean,
    onClick: () => void
}

export function ShowRow({ show, isSelected, onClick }: ShowRowProps) {
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
                <p className="font-bold capitalize">{show.title}</p>
                <p className="opacity-75">{show.year}</p>
            </div>

            <span className={cn("rounded-full text-center px-3 text-black/90 capitalize", {
                "bg-yellow-200": show.kind === 'film',
                "bg-purple-200": show.kind === 'serie',
            })}>{show.kind}</span>
        </div>
    );
}
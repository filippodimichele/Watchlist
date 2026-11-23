import { useState } from "react";
import type { Show } from "../data/watchlist";
import { Button } from "./Button";
import { cn } from "../utils/cn";
import { MorphIcon } from "morphicons/react";
import { Plus } from "lucide";

const MIN_YEAR = 1900;
const MAX_YEAR = 2026;

type AddShowFormProps = {
    existingShows: Show[];
    onSubmit: (show: Omit<Show, "id">) => Promise<void>;
};

const defaultState = {
    values: {
        title: "",
        year: 0,
        kind: "film" as Show["kind"],
        watched: false,
        rating: null,
    },
    errors: {
        title: [] as string[],
        year: [] as string[],
    }
};

const AddShowForm = ({ existingShows, onSubmit }: AddShowFormProps) => {
    const [formState, setFormState] = useState(defaultState);

    async function addShow(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        let errors = { ...defaultState.errors };

        setFormState(prev => ({
            ...prev,
            errors: defaultState.errors
        }));

        if (!formState.values.title.trim()) {
            errors = {
                ...errors,
                title: ["Titolo obbligatorio"]
            };
        }

        const normalizedTitle = formState.values.title.trim().toLowerCase();

        const isDuplicate = existingShows.some(show =>
            show.title.trim().toLowerCase() === normalizedTitle
        );

        if (isDuplicate) {
            errors = {
                ...errors,
                title: ["Questo titolo è già presente nella watchlist"]
            };
        }

        if (
            formState.values.year < MIN_YEAR ||
            formState.values.year > MAX_YEAR
        ) {
            errors = {
                ...errors,
                year: [`L'anno deve essere compreso tra il ${MIN_YEAR} e il ${MAX_YEAR}`]
            };
        }

        if (Object.values(errors).some(arr => arr.length)) {
            setFormState(prev => ({
                ...prev,
                errors
            }));
            return;
        }

        const newShow = { ...formState.values };

        await onSubmit(newShow);
        setFormState(defaultState);
    }

    return (
        <form onSubmit={addShow} className="flex flex-col gap-4">

            <input
                className={cn("bg-gray-200 p-2 rounded-lg border-2 border-transparent", {
                    "border-red-500": formState.errors.title.length > 0,
                })}
                placeholder="Titolo"
                value={formState.values.title}
                onChange={(e) => {
                    setFormState(prev => ({
                        ...prev,
                        values: {
                            ...prev.values,
                            title: e.target.value
                        }
                    }));
                }}
            />

            {formState.errors.title.map((error, i) => (
                <p key={i} className="text-red-500 text-xs">
                    {error}
                </p>
            ))}

            <input
                className={cn("bg-gray-200 p-2 rounded-lg border-2 border-transparent", {
                    "border-red-500": formState.errors.year.length > 0,
                })}
                placeholder="Anno"
                type="number"
                value={formState.values.year}
                onChange={(e) => {
                    setFormState(prev => ({
                        ...prev,
                        values: {
                            ...prev.values,
                            year: +e.target.value
                        }
                    }));
                }}
            />

            {formState.errors.year.map((error, i) => (
                <p key={i} className="text-red-500 text-xs">
                    {error}
                </p>
            ))}


            <div className="flex gap-4">
                {(["film", "serie"] as const).map(tipo => (
                    <Button
                        key={tipo}
                        type="button"
                        variant={formState.values.kind === tipo ? "active" : "default"}
                        onClick={() => {
                            setFormState(prev => ({
                                ...prev,
                                values: {
                                    ...prev.values,
                                    kind: tipo
                                }
                            }));
                        }}
                    >
                        {tipo}
                    </Button>
                ))}
            </div>

            <Button type="submit"
                className="bg-blue-500 text-white">
                <span className="flex items-center gap-2">
                    <MorphIcon icon={Plus} size={18} />
                    Aggiungi
                </span>
            </Button>

        </form>
    );
};

export default AddShowForm;
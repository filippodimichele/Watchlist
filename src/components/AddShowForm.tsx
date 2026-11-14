import { useState } from "react";
import type { Show } from "../data/watchlist";
import { Button } from "./Button";
import { cn } from "../utils/cn";

const MIN_YEAR = 1900;
const MAX_YEAR = 2026;

type AddShowFormProps = {
    onSubmit: (show: Omit<Show, "id">) => void;
};

const defaultState = {
    values: {
        title: "",
        year: 0,
        kind: "film" as Show["kind"],
    },
    errors: {
        title: [] as string[],
        year: [] as string[],
    }
};

const AddShowForm = ({ onSubmit }: AddShowFormProps) => {
    const [formState, setFormState] = useState(defaultState);

    function addShow(e: React.SubmitEvent<HTMLFormElement>) {
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

        setFormState(defaultState);
        onSubmit(newShow);
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

            <Button type="submit" variant="primary">
                Aggiungi
            </Button>

        </form>
    );
};

export default AddShowForm;

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Show } from "../data/watchlist";
import { Button } from "./Button";
import { cn } from "../utils/cn";
import { MorphIcon } from "morphicons/react";
import { Check, X } from "lucide";

const MIN_YEAR = 1900;
const MAX_YEAR = 2026;

type AddShowFormV2Props = {
    defaultValues?: Show;
    existingShows: Show[];
    onSubmit: (show: Omit<Show, "id">) => Promise<void>;
    onCancel?: () => void;
};

type FormState = {
    isSubmitting: boolean;
    values: Omit<Show, "id">;
    errors: {
        title: string[];
        year: string[];
    };
};

const defaultState: FormState = {
    isSubmitting: false,
    values: {
        title: "",
        year: 0,
        kind: "film",
        watched: false,
        rating: null,
    },
    errors: {
        title: [],
        year: [],
    }
};

const AddShowFormV2 = ({ defaultValues, existingShows, onSubmit, onCancel }: AddShowFormV2Props) => {
    const [formState, setFormState] = useState(defaultState);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        setFormState({
            ...defaultState,
            values: defaultValues ? { ...defaultValues } : { ...defaultState.values }
        });
        setSubmitError("");
    }, [defaultValues]);

    async function addShow(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let errors = { ...defaultState.errors };

        setFormState(prev => ({
            ...prev,
            errors: defaultState.errors
        }));

        setSubmitError("");

        if (!formState.values.title.trim()) {
            errors = {
                ...errors,
                title: ["Titolo obbligatorio"]
            };
        }
        const normalizedTitle = formState.values.title.trim().toLowerCase();

        const isDuplicate = existingShows.some(show =>
            show.title.trim().toLowerCase() === normalizedTitle &&
            show.id !== defaultValues?.id
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

        setFormState(prev => ({ ...prev, isSubmitting: true }));

        try {
            await onSubmit(formState.values);
            setFormState(defaultState);
        } catch {
            setSubmitError("Errore durante il salvataggio del titolo");
        } finally {
            setFormState(prev => ({
                ...prev,
                isSubmitting: false
            }));
        }
    }

    return (
        <form onSubmit={addShow} className="flex flex-col gap-4">

            <input
                disabled={formState.isSubmitting}
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
                disabled={formState.isSubmitting}
                className={cn("bg-gray-200 p-2 rounded-lg border-2 border-transparent", {
                    "border-red-500": formState.errors.year.length > 0,
                })}
                placeholder="Anno"
                type="number"
                value={formState.values.year || ""}
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
                        disabled={formState.isSubmitting}
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

            {submitError && (
                <p className="text-red-500 text-xs">{submitError}</p>
            )}

            <div className="flex gap-4">
                <Button className="bg-green-700 text-white"
                    type="submit"
                    variant="primary"
                    disabled={formState.isSubmitting}
                >
                    <span className="flex items-center gap-2">
                        <MorphIcon icon={Check} size={18} />

                    </span>
                    {defaultValues ? "Salva modifiche" : "Aggiungi"}
                </Button>

                {defaultValues && (
                    <Button className="bg-red-500 hover:bg-red-600 text-white"
                        type="button"
                        disabled={formState.isSubmitting}
                        onClick={onCancel}
                    >
                        <span className="flex items-center  gap-5">
                            <MorphIcon icon={X} size={18} />

                        </span>
                        Annulla modifica
                    </Button>
                )}
            </div>

        </form>
    );
};

export default AddShowFormV2;

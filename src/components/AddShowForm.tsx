
import { useState, type FormEvent } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import type { Show } from "../data/watchlist";

const MIN_YEAR = 1900;

type ShowFormValues = Pick<Show, "title" | "year" | "kind">;

type FormValues = {
    title: string;
    year: string;
    kind: Show["kind"];
};

type ExistingTitle = {
    id: number;
    title: string;
};

type FormErrors = {
    title: string[];
    year: string[];
};

type AddShowFormProps = {
    existingTitles: ExistingTitle[];
    editingShow?: Show;
    onAdd: (data: ShowFormValues) => void;
    onSave: (id: number, data: ShowFormValues) => void;
    onCancelEdit: () => void;
};

function buildState(editingShow?: Show) {
    return {
        values: {
            title: editingShow?.title ?? "",
            year: editingShow?.year.toString() ?? "",
            kind: editingShow?.kind ?? "film",
        } as FormValues,
        errors: { title: [], year: [] } as FormErrors,
        submitted: false,
    };
}


function getErrors(
    values: FormValues,
    existingTitles: ExistingTitle[],
    excludeId?: number
): FormErrors {
    const errors: FormErrors = { title: [], year: [] };
    const trimmedTitle = values.title.trim();

    if (!trimmedTitle) {
        errors.title.push("Titolo obbligatorio");
    } else {
        if (trimmedTitle.length < 2) {
            errors.title.push("Il titolo deve avere almeno 2 caratteri");
        }

        const isDuplicate = existingTitles.some(
            show =>
                show.id !== excludeId &&
                show.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
        );

        if (isDuplicate) {
            errors.title.push("Questo titolo è già in watchlist");
        }
    }

    const currentYear = new Date().getFullYear();
    const year = Number(values.year);

    if (
        !values.year ||
        !Number.isInteger(year) ||
        year < MIN_YEAR ||
        year > currentYear
    ) {
        errors.year.push(
            `L'anno deve essere compreso tra il ${MIN_YEAR} e il ${currentYear}`
        );
    }

    return errors;
}

const AddShowForm = ({
    existingTitles,
    editingShow,
    onAdd,
    onSave,
    onCancelEdit
}: AddShowFormProps) => {
    const [formState, setFormState] = useState(
        () => buildState(editingShow)
    );

    // ina sola funzione aggiorna qualsiasi campo del form.
    function updateValue<K extends keyof FormValues>(
        key: K,
        value: FormValues[K]
    ) {
        setFormState(prev => {
            const values = { ...prev.values, [key]: value };

            const errors = prev.submitted
                ? getErrors(values, existingTitles, editingShow?.id)
                : prev.errors;

            return { ...prev, values, errors };
        });
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const errors = getErrors(
            formState.values,
            existingTitles,
            editingShow?.id
        );

        if (Object.values(errors).some(arr => arr.length > 0)) {
            setFormState(prev => ({
                ...prev,
                errors,
                submitted: true
            }));
            return;
        }

        const data: ShowFormValues = {
            ...formState.values,
            year: Number(formState.values.year),
        };

        if (editingShow) {
            onSave(editingShow.id, data);
        } else {
            onAdd(data);
            setFormState(buildState());
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                placeholder="Titolo"
                value={formState.values.title}
                errors={formState.errors.title}
                onChange={e => updateValue("title", e.target.value)}
            />

            <Input
                placeholder="Anno"
                type="number"
                step={1}
                value={formState.values.year}
                errors={formState.errors.year}
                onChange={e => updateValue("year", e.target.value)}
            />

            <div className="flex gap-4">
                {(["film", "serie"] as const).map(tipo => (
                    <Button
                        key={tipo}
                        type="button"
                        variant={
                            formState.values.kind === tipo
                                ? "active"
                                : "default"
                        }
                        onClick={() => updateValue("kind", tipo)}
                    >
                        {tipo}
                    </Button>
                ))}
            </div>

            <div className="flex gap-4">
                <Button type="submit" variant="primary">
                    {editingShow ? "Salva" : "Aggiungi"}
                </Button>

                {editingShow && (
                    <Button
                        type="button"
                        variant="default"
                        onClick={onCancelEdit}
                    >
                        Annulla
                    </Button>
                )}
            </div>
        </form>
    );
};

export default AddShowForm;

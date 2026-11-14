import type { InputHTMLAttributes } from "react";
import { cn } from "../utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    errors?: string[];
};

export function Input({ errors = [], className, ...props }: InputProps) {
    const hasErrors = errors.length > 0;

    return (
        <div className="flex flex-col gap-1">
            <input
                className={cn(
                    "bg-gray-200 p-2 rounded-lg border-2 border-transparent",
                    { "border-red-500": hasErrors },
                    className
                )}
                {...props}
            />

            {errors.map((error, i) => (
                <p key={i} className="text-red-500 text-xs">
                    {error}
                </p>
            ))}
        </div>
    );
}

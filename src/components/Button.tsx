import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

type ButtonVariant = "default" | "active" | "primary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};

export function Button({ variant = "default", className, ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                "px-4 py-2 rounded-full capitalize transition-colors",
                {
                    "bg-gray-300 hover:bg-gray-400 text-black": variant === "default",
                    "bg-blue-500 text-white": variant === "active",
                    "bg-blue-500 hover:bg-blue-600 text-white": variant === "primary",
                },
                className
            )}
            {...props}
        />
    );
}

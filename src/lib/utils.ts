import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// conditional classes
export function cn(...inputs: ClassValue[]){

    return twMerge(clsx(inputs))
}

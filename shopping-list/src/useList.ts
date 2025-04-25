import { useContext } from "preact/hooks";
import { ListContext } from "./listContext";

export function useList() {
    const ctx = useContext(ListContext);
    if (!ctx) throw new Error("ListContext not found");
    return ctx;
}

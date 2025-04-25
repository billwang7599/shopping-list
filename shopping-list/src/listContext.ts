import { createContext } from "preact";
import { AppModel } from "./listModel";

export const ListContext = createContext<AppModel | null>(null);

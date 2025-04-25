import { signal, computed } from "@preact/signals";

export type ShoppingItem = {
    name: string;
    quantity: number;
    category: string;
    bought: boolean;
    shown: boolean;
};

export const items = signal<ShoppingItem[]>([]);

export const totalQuantity = computed(() =>
    items.value
        .filter((item) => item.shown)
        .reduce((sum, item) => sum + item.quantity, 0),
);

export const addItem = (name: string, quantity: number, category: string) => {
    const updated = [...items.value];
    const index = updated.findIndex((i) => i.name === name);
    if (index !== -1) {
        if (updated[index].shown) {
            updated[index].quantity = Math.min(
                24,
                updated[index].quantity + quantity,
            );
        } else {
            updated[index].quantity = Math.min(24, quantity);
            updated[index].shown = true;
        }
        updated[index].bought = false;
    } else {
        updated.push({ name, quantity, category, bought: false, shown: true });
    }
    items.value = updated;
};

export const removeItem = (name: string) => {
    const updated = [...items.value];
    const index = updated.findIndex((item) => item.name === name);
    if (index !== -1) {
        updated[index] = { ...updated[index], shown: false };
        items.value = updated;
    }
};

export const toggleBought = (name: string) => {
    const updated = [...items.value];
    const index = updated.findIndex((item) => item.name === name);
    if (index !== -1) {
        updated[index].bought = !updated[index].bought;
        items.value = updated;
    }
    console.log(items.value[index]);
};

export const itemExists = (name: string) => {
    return items.value.some((item) => item.name === name);
};

export const changeQuantity = (name: string, quantity: number) => {
    const updated = [...items.value];
    const index = updated.findIndex((item) => item.name === name);
    if (index !== -1) {
        updated[index].quantity = Math.max(0, Math.min(24, quantity));
        items.value = updated;
    }
};

export const changeCategory = (name: string, category: string) => {
    const updated = [...items.value];
    const index = updated.findIndex((item) => item.name === name);
    if (index !== -1) {
        updated[index].category = category;
        items.value = updated;
    }
};

export const getCategory = (name: string) => {
    const item = items.value.find((item) => item.name === name);
    return item ? item.category : "Other";
};

export const isLoading = signal(true);

export async function fetchItems() {
    isLoading.value = true;
    try {
        const res = await fetch(
            "https://student.cs.uwaterloo.ca/~cs349/resources/items.php",
        );
        const data = await res.json();
        data.forEach((item: ShoppingItem) => {
            item.shown = true;
        });
        items.value = data;
        console.log(items.value);
    } catch (err) {
        console.error("Failed to fetch items:", err);
        items.value = [];
    } finally {
        console.log("Finished fetching items");
        isLoading.value = false;
    }
}

export const createModel = () => {
    return {
        items,
        totalQuantity,
        addItem,
        toggleBought,
        itemExists,
        changeQuantity,
        removeItem,
        changeCategory,
        getCategory,
        isLoading,
        fetchItems,
    };
};

export type AppModel = ReturnType<typeof createModel>;

import { useList } from "./useList";
import { categories } from "./categories";
import { ShoppingItem } from "./listModel";
import { useState, useEffect } from "preact/hooks";

export const ListView = () => {
    const { items, isLoading } = useList();

    if (isLoading.value) {
        return (
            <div className="flex items-center justify-center m-16">
                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        );
    }

    // Gets all items of a category
    const getItemsByCategory = (categoryName: string): ShoppingItem[] => {
        return items.value.filter(
            (item) => item.category === categoryName && item.shown,
        );
    };
    return (
        <div>
            <div className="flex flex-col gap-[8px]">
                {categories.map((category) => (
                    <div
                        key={category.name}
                        style={{ backgroundColor: category.colour }}
                        className="display-flex flex-col text-black p-4"
                    >
                        <div className="display-flex text-center">
                            <span>{category.icon}</span>
                            {category.name}
                            {`(${
                                items.value.filter(
                                    (item) =>
                                        item.category === category.name &&
                                        item.bought &&
                                        item.shown,
                                ).length
                            }/${getItemsByCategory(category.name).length})`}
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            {getItemsByCategory(category.name)
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((item) => (
                                    <ItemView
                                        key={item.name}
                                        itemName={item.name}
                                    />
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ItemView = ({ itemName }: { itemName: string }) => {
    const { toggleBought, removeItem, changeQuantity } = useList();
    const { items } = useList();
    const item = items.value.find((i) => i.name === itemName)!;
    if (item.quantity == 0) {
        changeQuantity(item.name, 1);
    } else if (item.quantity > 24) {
        changeQuantity(item.name, 24);
    }
    const [quantity, setQuantity] = useState(item.quantity);

    // Update local state when item.quantity changes
    useEffect(() => {
        setQuantity(item.quantity);
    }, [item.quantity]);

    const handleQuantityChange = (e: Event) => {
        const value = parseInt((e.target as HTMLInputElement).value);
        let newQuantity = value;

        if (isNaN(value) || value <= 0) {
            newQuantity = 1;
        } else if (value > 24) {
            newQuantity = 24;
        }

        setQuantity(newQuantity);
        changeQuantity(item.name, newQuantity);
    };

    return (
        <div className="flex w-full justify-between bg-gray-500 p-4">
            <div className="flex min-w-0 flex-1">
                <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={() => toggleBought(item.name)}
                    className="mr-2 flex-shrink-0"
                />
                <label
                    className={`truncate ${item.bought ? "line-through" : ""}`}
                    style={{ flex: "1 1 auto" }}
                >
                    {item.name}
                </label>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
                {!item.bought && (
                    <input
                        type="number"
                        min="1"
                        max="24"
                        value={quantity}
                        className="w-16 text-right"
                        onInput={handleQuantityChange}
                    />
                )}
                <button onClick={() => removeItem(item.name)} className="ml-2">
                    ❌
                </button>
            </div>
        </div>
    );
};

import { useList } from "./useList";
import { categories } from "./categories";
import { useState, useEffect } from "preact/hooks";

export const AddView = () => {
    const { addItem, itemExists, getCategory } = useList();
    const [text, setText] = useState(""); // Add this state
    const [quantity, setQuantity] = useState(1); // Add this state
    const [category, setCategory] = useState("Other"); // Add this state
    const [active, setActive] = useState(true);

    useEffect(() => {
        if (itemExists(text)) {
            const category = getCategory(text);
            setCategory(category);
            setActive(false);
        } else {
            setActive(true);
        }
    }, [text]);

    const handleQuantityChange = (e: Event) => {
        const value = parseInt((e.target as HTMLInputElement).value);
        let newQuantity = value;
        console.log(newQuantity);

        if (isNaN(value) || value <= 0) {
            newQuantity = 1;
        } else if (value > 24) {
            newQuantity = 24;
        }

        setQuantity(newQuantity);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const name = (e.target as HTMLFormElement).elements[0].value;
                const quantity = parseInt(
                    (e.target as HTMLFormElement).elements[1].value,
                );
                const category = (e.target as HTMLFormElement).elements[2]
                    .value;
                if (!name || name[0] == " " || isNaN(quantity) || !category)
                    return;
                addItem(name, quantity, category);
                setText(""); // Reset the input field
                setQuantity(1); // Reset the quantity field
                setCategory("Other"); // Reset the category field
            }}
        >
            <div className="flex">
                <input
                    type="text"
                    placeholder="Item Name"
                    value={text}
                    className="flex-1 border border-gray-300 rounded px-2 py-1"
                    pattern="[A-Za-z]+(?: [A-Za-z]+)*"
                    onInput={(e: Event) =>
                        setText((e.target as HTMLInputElement).value)
                    }
                />
                <input
                    type="number"
                    value={quantity}
                    onInput={handleQuantityChange}
                    min={1}
                    max={24}
                    step={1}
                    className="border border-gray-300 rounded px-2 py-1 w-16"
                />
                <select
                    className="border border-gray-300 rounded px-2 py-1"
                    value={category}
                    disabled={!active}
                    onInput={(e) => setCategory(e.target.value)}
                >
                    {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                            {category.icon}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="border border-gray-300 rounded px-2 py-1"
                >
                    ➕
                </button>
            </div>
        </form>
    );
};

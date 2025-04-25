import { categories } from "./categories";
import { useList } from "./useList";

interface CategoryViewProps {
    setView: (view: string) => void;
}

export const CategoryView = ({ setView }: CategoryViewProps) => {
    const { items, changeCategory } = useList();

    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]">
            <div className="flex flex-col m-4">
                <button
                    onClick={() => setView("list")}
                    className="flex justify-end text-white text-2xl hover:text-gray-300"
                >
                    ✕
                </button>
                <div className="flex flex-wrap gap-[8px]">
                    {items.value
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((item) => (
                            <div
                                key={item.name}
                                className="flex flex-col w-[80px]"
                            >
                                <label className={`truncate`}>
                                    {item.name}
                                </label>
                                <select
                                    className="text-right"
                                    value={item.category}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        changeCategory(item.name, val);
                                    }}
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category.name}
                                        >
                                            {category.name + category.icon}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

import { useList } from "./useList";
import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export const prices = signal<Record<string, number | null>>({});
export const isFetchingPrices = signal<Record<string, boolean>>({});

export async function fetchPriceFor(itemName: string) {
    isFetchingPrices.value = { ...isFetchingPrices.value, [itemName]: true };
    try {
        const res = await fetch(
            `https://student.cs.uwaterloo.ca/~cs349/resources/prices.php?item=${encodeURIComponent(itemName)}`,
        );
        const data = await res.json();
        prices.value = { ...prices.value, [itemName]: data.price };
    } catch (err) {
        console.error(`Error fetching price for ${itemName}:`, err);
        prices.value = { ...prices.value, [itemName]: null };
    } finally {
        isFetchingPrices.value = {
            ...isFetchingPrices.value,
            [itemName]: false,
        };
    }
}
interface ExpenseViewProps {
    setView: (view: string) => void;
}

export const ExpenseView = ({ setView }: ExpenseViewProps) => {
    const { items } = useList();
    useEffect(() => {
        prices.value = {};
        isFetchingPrices.value = {};
        for (const item of items.value.filter((i) => i.bought)) {
            if (prices.value[item.name] == null) {
                fetchPriceFor(item.name);
            }
        }
    }, []);

    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]">
            <div className="flex flex-col m-4">
                <button
                    onClick={() => setView("list")}
                    className="flex justify-end text-white text-2xl hover:text-gray-300"
                >
                    ✕
                </button>
                <table class="border-separate border-spacing-x-4 border-spacing-y-2">
                    <tbody>
                        {items.value
                            .filter((i) => i.bought)
                            .map((item) => (
                                <tr key={item.name} className="gap-4">
                                    <td className="w-full">{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td> x </td>
                                    <td>
                                        {isFetchingPrices.value[item.name] ? (
                                            <span class="animate-pulse">
                                                ...
                                            </span>
                                        ) : (
                                            "$" +
                                            (prices.value[item.name]?.toFixed(
                                                2,
                                            ) ?? "N/A")
                                        )}
                                    </td>
                                    <td> = </td>
                                    <td>
                                        {isFetchingPrices.value[item.name] ? (
                                            <span class="animate-pulse">
                                                ...
                                            </span>
                                        ) : prices.value[item.name] != null ? (
                                            "$" +
                                            (
                                                item.quantity *
                                                prices.value[item.name]!
                                            ).toFixed(2)
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="font-bold">Total:</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="font-bold">
                                {"$" +
                                    items.value
                                        .filter((item) => item.bought)
                                        .reduce(
                                            (acc, item) =>
                                                acc +
                                                item.quantity *
                                                    (prices.value[item.name]
                                                        ? prices.value[
                                                              item.name
                                                          ]
                                                        : 0),
                                            0,
                                        )
                                        .toFixed(2)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

import { render } from "preact";
import "./style.css";
import { createModel } from "./listModel";
import { ListContext } from "./listContext";
import { ListView } from "./listView";
import { useEffect, useState } from "preact/hooks";
import { AddView } from "./addView";
import { CategoryView } from "./categoryView";
import { ExpenseView } from "./expenseView";

export function App() {
    const model = createModel();
    useEffect(() => {
        model.fetchItems();
    }, []);
    const [view, setView] = useState("list");
    return (
        <div class="flex items-center justify-center">
            <div className="m-16 flex flex-col gap-[16px] max-w-[600px] min-w-[400px] relative">
                <ListContext.Provider value={model}>
                    <div className="flex w-full gap-[8px]">
                        <button
                            className="w-full bg-blue-500 text-white"
                            onClick={() => setView("category")}
                        >
                            ✍🏻 Edit Categories
                        </button>
                        <button
                            className="w-full bg-blue-500 text-white"
                            onClick={() => setView("expense")}
                        >
                            💵 Show Expenses
                        </button>
                    </div>
                    <AddView />
                    <ListView />
                    <div
                        style={{
                            fontSize: `${Math.min(20 + model.totalQuantity.value, 40)}px`,
                            color:
                                model.totalQuantity.value > 10
                                    ? "#ff6b6b"
                                    : "#4CAF50",
                            textAlign: "center",
                        }}
                    >
                        {model.totalQuantity.value === 0
                            ? "😢 Your cart is empty!"
                            : model.totalQuantity.value < 10
                              ? "🛒 Just getting started!"
                              : model.totalQuantity.value < 40
                                ? "🎉 Now we're shopping!"
                                : "🚀 Shopping SPREE!!!"}
                        <br />
                        {model.totalQuantity.value} items and counting!
                    </div>
                    {view === "category" ? (
                        <CategoryView setView={setView} />
                    ) : null}
                    {view === "expense" ? (
                        <ExpenseView setView={setView} />
                    ) : null}
                </ListContext.Provider>
            </div>
        </div>
    );
}

render(<App />, document.getElementById("app"));

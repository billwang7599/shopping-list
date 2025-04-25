export const categories = [
    { icon: "🥛", name: "Dairy", colour: `hsl(220, 75%, 75%)` },
    { icon: "🧊", name: "Frozen", colour: `hsl(220, 90%, 95%)` },
    { icon: "🍌", name: "Fruit", colour: `hsl(140, 75%, 75%)` },
    { icon: "🛒", name: "Other", colour: `hsl(0, 0%, 90%)` },
];

export const getCategory = (name: string) => {
    return categories.find((category) => category.name === name);
};

import { Signal, useSignal } from "@preact/signals";
import { useList } from "./useList";

interface NumberInputProps {
    className?: string;
    immediate?: string;
    resetSignal?: Signal;
}

export const NumberInput: preact.FunctionComponent<NumberInputProps> = ({
    className,
    immediate = "",
    resetSignal,
}) => {
    const { changeQuantity } = useList();
    const quantity = useSignal(1);

    const handleQuantityChange = (e: Event) => {
        const value = parseInt((e.target as HTMLInputElement).value);
        let newQuantity = value;

        if (isNaN(value) || value <= 0) {
            newQuantity = 1;
        } else if (value > 24) {
            newQuantity = 24;
        }

        quantity.value = newQuantity;
        if (immediate !== "") {
            changeQuantity(immediate, quantity.value);
        }
    };

    if (resetSignal && resetSignal.value) {
        quantity.value = 1;
    }
    return (
        <input
            type="number"
            value={quantity.value}
            onInput={handleQuantityChange}
            min={1}
            max={24}
            step={1}
            className={`${className}`}
        />
    );
};

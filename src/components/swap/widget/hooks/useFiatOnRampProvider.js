import { useCallback } from "react";
import { useFiatOnRampStore } from "../store/useFiatOnRampStore";

export const useFiatOnRampProvider = () => {
    const setSelectedProvider = useFiatOnRampStore((store) => store.setSelectedProvider);

    const clearProvider = useCallback(() => {
        setSelectedProvider(undefined);
    }, [setSelectedProvider]);

    return {
        clearProvider,
    };
}
import { useCallback, useState } from "react";

export function useClipboard() {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback(async (text) => {
        try {
            await navigator?.clipboard?.writeText(text);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 1000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    }, []);

    return { isCopied, copyToClipboard };
}
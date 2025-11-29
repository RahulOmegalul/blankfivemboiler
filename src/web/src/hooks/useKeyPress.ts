import { useEffect } from "react";

export function useKeyPress(targetKey: string, callback: () => void, enabled = true) {
    useEffect(() => {
        if(!enabled) return;
        const downHandler = (event: KeyboardEvent) => {
            if (event.key === targetKey) {
                callback();
            }
        };
        window.addEventListener('keydown', downHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
        }
    }, [targetKey, callback, enabled]);
}
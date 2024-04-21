import { useEffect, useRef } from "react";

export type RoutineFunction = (stop: () => void, dtime: number, now: number) => void;

export function useRoutine(fn: RoutineFunction, delayMs: number) {
    const lastAdd = useRef<number>(Date.now());

    useEffect(() => {
        let intervalId: any;

        const timeoutId = setTimeout(
            () => {
                const now = Date.now();
                const dtime = now - lastAdd.current;
                lastAdd.current = now;
                fn(() => clearTimeout(timeoutId), dtime, now);
                intervalId = setInterval(() => {
                    const now = Date.now();
                    const dtime = now - lastAdd.current;
                    lastAdd.current = now;
                    fn(() => clearInterval(intervalId), dtime, now);
                }, delayMs);
            },
            delayMs - (Date.now() - lastAdd.current),
        );

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [delayMs, fn]);
}

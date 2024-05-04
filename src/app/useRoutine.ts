import {
  DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type RoutineFunction = (
  stop: () => void,
  dtime: number,
  now: number,
) => void;

export const RoutineStoppedError = {
  message: "Routine was stopped",
};

export function useRoutine(
  fn: RoutineFunction,
  delayMs: number,
  deps: DependencyList = [],
) {
  const timeLastRun = useRef<number>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _fn = useCallback(fn, deps);

  useEffect(() => {
    let intervalId: any;

    timeLastRun.current = timeLastRun.current ?? Date.now();

    const timeoutId = setTimeout(
      () => {
        const now = Date.now();
        const dtime = now - timeLastRun.current!;

        timeLastRun.current = now;

        try {
          _fn(
            () => {
              clearTimeout(timeoutId);
              timeLastRun.current = void 0;
              throw RoutineStoppedError;
            },
            dtime,
            now,
          );

          intervalId = setInterval(() => {
            const now = Date.now();
            const dtime = now - timeLastRun.current!;

            timeLastRun.current = now;

            try {
              _fn(
                () => {
                  clearInterval(intervalId);
                  timeLastRun.current = void 0;
                  throw RoutineStoppedError;
                },
                dtime,
                now,
              );
            } catch (err) {
              if (err !== RoutineStoppedError) throw err;
            }
          }, delayMs);
        } catch (err) {
          if (err !== RoutineStoppedError) throw err;
        }
      },
      delayMs - (Date.now() - timeLastRun.current),
    );

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [delayMs, _fn]);
}

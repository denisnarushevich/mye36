import clsx from "clsx";

export function Car({ speed }: { speed: number }) {
  return (
    <div className="relative w-[320px] h-[160px] px-[32px] flex justify-between items-end">
      <div className="absolute inset-0 bg-base-200 bottom-[32px] top-[64px]"></div>

      <div className="absolute bg-base-200 bottom-[32px] top-0 left-8 right-[64px]"></div>
      <div className="absolute bg-blue-400 bottom-[100px] top-4 left-12 right-[72px]"></div>
      <div className="absolute bg-yellow-200 w-6 h-6 rounded-xl bottom-[64px] right-[8px]"></div>
      <div className="absolute bg-red-400 w-3 h-3 rounded-xl bottom-[56px] left-[12px]"></div>
      <div className="absolute bg-orange-400 w-3 h-3 rounded-xl bottom-[72px] left-[12px]"></div>

      <div
        className={clsx(
          "relative h-[64px] w-[64px] rounded-full border-[12px] border-black overflow-hidden animate-wheel-spin transform rotate-90",
        )}
        style={{
          animationPlayState: speed > 0 ? "running" : "paused",
        }}
      >
        <div className="h-1/2 flex">
          <div className="w-1/2 h-full bg-gray-100" />
          <div className="w-1/2 h-full bg-transparent" />
        </div>
        <div className="h-1/2 flex">
          <div className="w-1/2 h-full bg-transparent" />
          <div className="w-1/2 h-full bg-gray-100" />
        </div>
      </div>

      <div
        className={clsx(
          "relative h-[64px] w-[64px] rounded-full border-[12px] border-black overflow-hidden animate-wheel-spin animation-p",
        )}
        style={{
          animationPlayState: speed > 0 ? "running" : "paused",
        }}
      >
        <div className="h-1/2 flex">
          <div className="w-1/2 h-full bg-transparent" />
          <div className="w-1/2 h-full bg-gray-100" />
        </div>
        <div className="h-1/2 flex">
          <div className="w-1/2 h-full bg-gray-100" />
          <div className="w-1/2 h-full bg-transparent" />
        </div>
      </div>
    </div>
  );
}

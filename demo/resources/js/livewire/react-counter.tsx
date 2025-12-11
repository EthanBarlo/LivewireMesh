import React from "react";
import { useEntangle } from "@livewiremesh/react/hooks/useEntangle";

interface ReactCounterProps {
    initialCount: number;
}

const ReactCounter: React.FC<ReactCounterProps> = ({ initialCount }) => {
    const [count, setCount] = useEntangle<number>("count", initialCount);

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        setCount(count - 1);
    };

    const handleReset = () => {
        setCount(initialCount);
    };

    return (
        <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500" />

            {/* Card */}
            <div className="relative p-8 rounded-2xl bg-slate-800/80 border border-white/10 backdrop-blur-xl">
                <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 block">
                        React Counter
                    </span>

                    {/* Counter Display */}
                    <div className="my-6">
                        <span className="text-7xl font-bold tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                            {count}
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={handleDecrement}
                            type="button"
                            className="w-14 h-14 rounded-xl bg-slate-700/50 border border-white/10 text-white text-2xl font-medium hover:bg-slate-700 hover:border-white/20 active:scale-95 transition-all duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                            aria-label="Decrement counter"
                            tabIndex={0}
                        >
                            −
                        </button>

                        <button
                            onClick={handleReset}
                            type="button"
                            className="px-5 h-14 rounded-xl bg-slate-700/30 border border-white/5 text-slate-400 text-sm font-medium hover:bg-slate-700/50 hover:text-slate-300 active:scale-95 transition-all duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                            aria-label="Reset counter"
                            tabIndex={0}
                        >
                            Reset
                        </button>

                        <button
                            onClick={handleIncrement}
                            type="button"
                            className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-2xl font-medium hover:from-cyan-600 hover:to-blue-600 active:scale-95 transition-all duration-150 shadow-lg shadow-cyan-500/25 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                            aria-label="Increment counter"
                            tabIndex={0}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReactCounter;

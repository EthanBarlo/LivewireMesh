<div class="relative group">
    <!-- Glow effect -->
    <div class="absolute -inset-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
    
    <!-- Card -->
    <div x-data="{ count: $wire.entangle('count') }" class="relative p-8 rounded-2xl bg-slate-800/80 border border-white/10 backdrop-blur-xl">
        <div class="text-center">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 block">
                Livewire Counter
            </span>
            
            <!-- Counter Display -->
            <div class="my-6">
                <span class="text-7xl font-bold tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400" x-text="count">0</span>
            </div>

            <!-- Buttons -->
            <div class="flex items-center justify-center gap-3">
                <button
                    @click="count--"
                    type="button"
                    class="w-14 h-14 rounded-xl bg-slate-700/50 border border-white/10 text-white text-2xl font-medium hover:bg-slate-700 hover:border-white/20 active:scale-95 transition-all duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    aria-label="Decrement counter"
                    tabindex="0"
                >
                    −
                </button>

                <button
                    @click="count = 0"
                    type="button"
                    class="px-5 h-14 rounded-xl bg-slate-700/30 border border-white/5 text-slate-400 text-sm font-medium hover:bg-slate-700/50 hover:text-slate-300 active:scale-95 transition-all duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    aria-label="Reset counter"
                    tabindex="0"
                >
                    Reset
                </button>

                <button
                    @click="count++"
                    type="button"
                    class="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white text-2xl font-medium hover:from-rose-600 hover:to-orange-600 active:scale-95 transition-all duration-150 shadow-lg shadow-rose-500/25 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    aria-label="Increment counter"
                    tabindex="0"
                >
                    +
                </button>
            </div>
        </div>
    </div>
</div>

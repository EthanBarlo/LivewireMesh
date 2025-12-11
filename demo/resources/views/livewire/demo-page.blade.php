<div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span class="text-xl font-bold text-white">LivewireMesh</span>
            </div>
            <a 
                href="https://github.com" 
                target="_blank"
                class="text-slate-400 hover:text-white transition-colors"
                aria-label="View on GitHub"
            >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
            </a>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <!-- Hero Section -->
        <div class="text-center mb-12 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-6">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Live Demo
            </div>
            <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
                React Components in
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Livewire</span>
            </h1>
            <p class="text-lg text-slate-400 leading-relaxed">
                Build reactive Laravel applications using React components seamlessly integrated with Livewire's powerful backend.
            </p>
        </div>

        <!-- Counter Cards -->
        <div class="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <livewire:counter wire:model="count" />
            <livewire:react-counter wire:model="count" />
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl w-full">
            <div class="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 class="font-semibold text-white mb-1">Reactive</h3>
                <p class="text-sm text-slate-400">Real-time updates without page reloads</p>
            </div>
            <div class="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div class="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
                    <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                </div>
                <h3 class="font-semibold text-white mb-1">State Sync</h3>
                <p class="text-sm text-slate-400">Seamless state between React & PHP</p>
            </div>
            <div class="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </div>
                <h3 class="font-semibold text-white mb-1">Flexible</h3>
                <p class="text-sm text-slate-400">Use your favorite React libraries</p>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/10 py-6">
        <div class="max-w-5xl mx-auto px-6 text-center text-sm text-slate-500">
            Built with Laravel, Livewire & React
        </div>
    </footer>
</div>

// Shared class strings for interactive elements.

export const button = {
  primary:
    "inline-flex items-center justify-center gap-2.5 rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold text-on-accent shadow-lg shadow-brand/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/40 active:translate-y-0 active:scale-[0.98] cursor-pointer",
  secondary:
    "inline-flex items-center justify-center gap-2.5 rounded-2xl border border-rule bg-surface/60 px-6 py-3.5 text-sm font-bold text-ink backdrop-blur-sm transition-all duration-300 hover:border-brand hover:text-accent active:scale-[0.98] cursor-pointer",
  soft:
    "inline-flex items-center gap-2 rounded-xl border border-brand/25 bg-brand/10 px-4 py-2 text-xs font-bold text-accent transition-all hover:bg-accent hover:text-on-accent active:scale-95 cursor-pointer",
  text:
    "group/cta inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3 cursor-pointer",
  icon:
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-black/5 text-ink/80 backdrop-blur-md transition-all duration-300 hover:bg-black/10 hover:text-ink dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10 cursor-pointer",
  ghost:
    "inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-all duration-300 hover:bg-ink/5 hover:text-ink cursor-pointer",
};

/** Glass panel used for cards. */
export const card =
  "group relative rounded-3xl border border-rule bg-surface/70 backdrop-blur-sm transition-all duration-500 hover:border-brand/40 dark:bg-surface/40";

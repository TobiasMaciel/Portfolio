"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Chip from "./Chip";

export default function StackList({
  items,
  limit,
  isEs,
  tone = "accent",
}: {
  items: string[];
  limit?: number;
  isEs: boolean;
  tone?: "neutral" | "accent";
}) {
  const [expanded, setExpanded] = useState(false);
  const canCollapse = limit !== undefined && items.length > limit;
  const visible = canCollapse && !expanded ? items.slice(0, limit) : items;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {visible.map((s) => (
        <motion.li
          key={s}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Chip tone={tone}>{s}</Chip>
        </motion.li>
      ))}
      {canCollapse && (
        <motion.li layout>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="rounded-full border border-rule px-3 py-1 text-xs font-semibold text-muted transition-colors hover:border-brand/40 hover:text-accent cursor-pointer"
          >
            {expanded
              ? isEs ? "Ver menos" : "Show less"
              : `+${items.length - limit} ${isEs ? "más" : "more"}`}
          </button>
        </motion.li>
      )}
    </ul>
  );
}

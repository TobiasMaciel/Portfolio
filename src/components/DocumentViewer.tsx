"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DocumentViewer({
  url,
  title,
  subtitle,
  onClose,
}: {
  url: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-[#121214] w-[98%] sm:w-[92%] md:w-[88%] lg:w-full max-w-5xl h-[95vh] lg:h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-zinc-200 dark:border-zinc-800"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#A78BFA]/10 flex items-center justify-center text-[#A78BFA] border border-[#A78BFA]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-zinc-900 dark:text-white">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[10px] font-bold tracking-widest text-[#A78BFA] uppercase">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={url}
              download={url.split('/').pop()}
              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/10 dark:shadow-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              <span className="hidden sm:inline">Descargar</span>
            </a>
            <button
              onClick={onClose}
              className="group p-2.5 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-all duration-300 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:rotate-90 transition-transform duration-300"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 bg-zinc-50 dark:bg-black/40 relative overflow-hidden">
          {url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
            <div className="relative w-full h-full p-4 sm:p-12">
              <Image
                src={url}
                alt={title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          ) : (
            <iframe
              src={`${url}#toolbar=0&navpanes=0`}
              className="w-full h-full border-none shadow-sm"
              title="Document Viewer"
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

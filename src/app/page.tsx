import LayoutAnimation from "@/components/LayoutAnimation";
import CursorGlow from "@/components/CursorGlow";

export default function Home() {
  return (
    // justify-between empujará automáticamente el bloque derecho lejos del izquierdo
    <main className="flex flex-col lg:flex-row justify-between bg-[#0A0A0B] text-zinc-200 relative min-h-screen overflow-hidden">
      {/* Elemento de luz Global anclado al viewport absoluto */}
      {/* Lo ubicamos DENTRO del main para que el fondo negro no lo aplaste */}
      <CursorGlow />

      {/* Left side: Static Information */}
      <section className="hidden lg:flex w-[45%] flex-col pt-[15vh] pl-10 lg:pl-16 xl:pl-20 z-20">
        <h1 className="font-playfair text-5xl md:text-6xl xl:text-7xl tracking-tight leading-none text-white font-bold w-full drop-shadow-lg">
          TOBÍAS ALEJANDRO
          <br />
          <span className="text-zinc-500">MACIEL MEISTER</span>
        </h1>
        <p className="font-sans text-xl mt-4 text-zinc-400 font-light tracking-wide drop-shadow-sm">
          Desarrollador Full-Stack & DevOps
        </p>

        <div className="flex gap-4 mt-8">
          <a
            href="mailto:tobiasmaciel03@gmail.com"
            className="flex items-center justify-center w-11 h-11 bg-zinc-900/80 rounded-full hover:bg-zinc-800 transition-colors text-zinc-300 backdrop-blur-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/tobiasmaciel"
            target="_blank"
            className="flex items-center justify-center w-11 h-11 bg-zinc-900/80 rounded-full hover:bg-zinc-800 transition-colors text-zinc-300 backdrop-blur-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href="https://github.com/tobiasmaciel"
            target="_blank"
            className="flex items-center justify-center w-11 h-11 bg-zinc-900/80 rounded-full hover:bg-zinc-800 transition-colors text-zinc-300 backdrop-blur-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0 .2-3.8s-1.2-.4-3.9 1.8a13.2 13.2 0 0 0-7 0C6.2 3.4 5 3.8 5 3.8a5.5 5.5 0 0 0 .2 3.8A5.5 5.5 0 0 0 3 11.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
              <path d="M9 18c-4.5 1.6-5-2.5-5-2.5" />
            </svg>
          </a>
        </div>
      </section>

      {/* Mobile view top text */}
      <section className="lg:hidden w-full px-10 pt-16 pb-8 z-20 relative">
        <h1 className="font-playfair text-5xl tracking-tight leading-none text-white font-bold w-full drop-shadow-md">
          TOBÍAS ALEJANDRO
          <br />
          <span className="text-zinc-500">MACIEL MEISTER</span>
        </h1>
        <p className="font-sans text-xl mt-4 text-zinc-400 font-light tracking-wide">
          Desarrollador Full-Stack & DevOps
        </p>
      </section>

      {/* Right side: Interactive CV */}
      <section className="w-full lg:w-[50%] lg:pr-10 xl:pr-20 relative z-10 pb-24 border-none outline-none ring-0">
        <div className="w-full flex-1 relative lg:mt-[15vh]">
          <LayoutAnimation />
        </div>
      </section>
    </main>
  );
}

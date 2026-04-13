# 🚀 Portfolio Profesional

¡Bienvenido a mi portfolio interactivo! Este repositorio contiene el código fuente de mi sitio web personal, diseñado con un enfoque absoluto en **alto rendimiento**, **animaciones fluidas premium** y **arquitectura de código limpia**. 

Construido utilizando tecnologías modernas para demostrar capacidades avanzadas en el desarrollo Frontend.

---

## 🛠️ Stack Tecnológico y Arquitectura

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Rendimiento:** Filtros CSS acelerados por Hardware, Descarga del motor de diseño, Patrones de Intersect Observer.
- **Manejo de Estado:** React Hooks & Context API

## ✨ Características Principales

- 🎭 **Micro-animaciones Interactivas Basadas en Físicas:** Los elementos ambientales de fondo reaccionan dinámicamente a tu mouse utilizando animaciones de diseño personalizadas con cálculos físicos matemáticos.
- 🎨 **Tema e Internacionalización:** Cambios instantáneos entre modo Oscuro/Claro junto con soporte para Inglés/Español, persistiendo de manera fluida sin errores de hidratación (hydration mismatch).
- 🧩 **Arquitectura Modular:** Componentes UI atómicos extraídos (`ProjectModal`, `DocumentViewer`, `Lightbox`, `MiniCarousel`) para una mantenibilidad máxima y código limpio.
- 🚀 **Renderizado 100% Optimizado:** Los elementos gráficos complejos como las esferas de luz utilizan hooks de `requestAnimationFrame` y desenfoques CSS escalados para lograr 60 FPS estables en cualquier dispositivo móvil o de escritorio.
- 📱 **Mobile-First Responsive:** Una disposición impecable que se adapta con precisión desde pantallas ultra anchas hasta pantallas de móviles.
- ♿ **Accesibilidad:** Límites semánticos HTML, etiquetas ARIA correctas, y soporte para navegación con teclado desde el inicio.

## 📂 Estructura del Proyecto

```text
.
├── src/
│   ├── app/                 # Next.js App Router (Layouts & Pages)
│   ├── components/          # Componentes UI Compartidos (Modales, Iconos, Animaciones)
│   ├── context/             # Estado Global (LanguageContext)
│   ├── data/                # Modelos de contenido (datos del portfolio & traducciones)
│   └── types/               # Definiciones de Tipos en TypeScript
├── public/                  # Archivos estáticos y de recursos visuales
├── package.json
└── README.md
```

## 🚀 Empezando

Para ejecutar de manera local este proyecto, simplemente clona el repositorio e instala todas sus dependencias:

```bash
# Instalar paquetes
npm install
# o yarn install

# Empezar Servidor Dev Local
npm run dev
# o yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación corriendo desde tu navegador.


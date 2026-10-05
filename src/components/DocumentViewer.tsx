"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import Modal from "./ui/Modal";
import { button } from "./ui/styles";

export default function DocumentViewer({
  url,
  title,
  subtitle,
  onClose,
  isEs,
}: {
  url: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  isEs: boolean;
}) {
  const isImage = /\.(jpe?g|png|webp)$/i.test(url);

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      closeLabel={isEs ? "Cerrar" : "Close"}
      zIndex={200}
      actions={
        <a
          href={url}
          download={url.split("/").pop()}
          className={`${button.secondary} px-3 py-2 sm:px-4`}
        >
          <Download size={16} aria-hidden="true" />
          <span className="hidden sm:inline">
            {isEs ? "Descargar" : "Download"}
          </span>
        </a>
      }
    >
      <div className="relative flex-1 bg-paper">
        {isImage ? (
          <div className="absolute inset-4 sm:inset-10">
            <Image
              src={url}
              alt={subtitle ?? title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        ) : (
          <iframe
            src={`${url}#toolbar=0&navpanes=0`}
            className="absolute inset-0 h-full w-full border-none"
            title={subtitle ?? title}
          />
        )}
      </div>
    </Modal>
  );
}

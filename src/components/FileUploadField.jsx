"use client";

import { useRef, useState } from "react";
import { UploadIcon } from "@/components/UploadIcon";
import { FileIcon } from "@/components/FileIcon";
import { RemoveIcon } from "@/components/RemoveIcon";

const ACCEPTED_EXTENSIONS = [".pdf", ".txt", ".md"];

function hasAcceptedExtension(file) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

// Clave para identificar cada archivo (para el "key" de React y para detectar archivos duplicados
function fileKey(file) {
  return `${file.name}-${file.size}`;
}

export function FileUploadField({ id = "files", name = "files" }) {
  const [files, setFiles] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputRef = useRef(null);

  function syncInputFiles(nextFiles) {
    // Funcion para construir un objeto FileList aceptado por el input. Sincroniza la lista con los archivos a enviar en el form y la lista mostrada en pantalla
    const dataTransfer = new DataTransfer();
    nextFiles.forEach((file) => dataTransfer.items.add(file));
    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }
    setFiles(nextFiles);
  }

  // Añade archivos nuevos a los que ya había en vez de reemplazarlos
  function addFiles(newFiles) {
    const existingKeys = new Set(files.map(fileKey));
    const uniqueNewFiles = newFiles.filter(
      (file) => !existingKeys.has(fileKey(file)),
    );
    if (uniqueNewFiles.length === 0) return;
    syncInputFiles([...files, ...uniqueNewFiles]);
  }

  function handleRemove(key) {
    syncInputFiles(files.filter((file) => fileKey(file) !== key));
  }

  function handleChange(event) {
    addFiles(Array.from(event.target.files ?? []));
  }

  function handleDragOver(event) {
    // Sin este preventDefault(), el navegador no permite soltar aquí, sino que intenta abrir el archivo en una pestaña nueva.
    event.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragLeave() {
    setIsDraggingOver(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDraggingOver(false);

    const droppedFiles = Array.from(event.dataTransfer.files ?? []).filter(
      hasAcceptedExtension,
    );

    if (droppedFiles.length === 0) return;

    addFiles(droppedFiles);
  }

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDraggingOver
            ? "border-indigo-400 bg-indigo-50/40"
            : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/40"
        }`}
      >
        <UploadIcon />
        <span className="text-sm font-medium text-slate-700">
          Arrastra tus archivos aquí o haz clic para elegirlos
        </span>
        <span className="text-xs text-slate-400">PDF, TXT o MD</span>

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept=".pdf,.txt,.md"
          multiple
          required
          onChange={handleChange}
          className="sr-only"
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={fileKey(file)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <FileIcon />
              <span className="flex-1 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(fileKey(file))}
                aria-label={`Quitar ${file.name}`}
                className="shrink-0 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <RemoveIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

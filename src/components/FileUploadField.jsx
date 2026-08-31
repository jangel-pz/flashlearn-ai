"use client";

import { useRef, useState } from "react";
import { FileIcon, RemoveIcon, UploadIcon } from "@/components/icons";

const ACCEPTED_EXTENSIONS = [".pdf", ".txt", ".md"];

/**
 * Comprueba si un archivo determinado posee una extension
 * admitida por la aplicacion
 * @param {File} file - Archivo a comprobar
 * @returns {boolean} true si la extension del archivo es valida, false en caso contrario
 */
function hasAcceptedExtension(file) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

// Clave para identificar cada archivo (para el "key" de React y para detectar archivos duplicados
/**
 * Genera un identificador para el archivo recibido. Dicho
 * identificador se utiliza como atributo "key" en componentes
 * de React y como ayuda para detectar duplicados
 * @param {File} file - Archivo a comprobar
 * @returns {number} El identificador del archivo
 */
function fileKey(file) {
  return `${file.name}-${file.size}`;
}

/**
 * Componente que actua como input para subir uno o varios
 * archivos a un formulario. Lista los archivos subidos y
 * permite eliminar uno o varios antes de enviarlos. Debe
 * integrarse en un formulario
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - Identificador del input dentro del formulario
 * @param {string} props.name - Nombre del input dentro del formulario
 */
export function FileUploadField({ id = "files", name = "files" }) {
  const [files, setFiles] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputRef = useRef(null);

  /**
   * Construye un objeto FileList a partir de un array de
   * archivos. Sincroniza la lista con los archivos a enviar en
   * el formulario con la lista de archivos subidos mostrada en
   * pantalla
   * @param {Array<File>} nextFiles - Archivos a enviar en el formulario
   */
  function syncInputFiles(nextFiles) {
    const dataTransfer = new DataTransfer();
    nextFiles.forEach((file) => dataTransfer.items.add(file));
    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }
    setFiles(nextFiles);
  }

  // Añade archivos nuevos a los que ya había en vez de reemplazarlos
  /**
   * Añade el/los archivo(s) recibido(s) a la lista de archivos
   * a enviar en el formulario
   * @param {Array<File>} newFiles - Archivo(s) nuevo(s) a enviar en el formulario
   */
  function addFiles(newFiles) {
    const existingKeys = new Set(files.map(fileKey));
    const uniqueNewFiles = newFiles.filter(
      (file) => !existingKeys.has(fileKey(file)),
    );
    if (uniqueNewFiles.length === 0) return;
    syncInputFiles([...files, ...uniqueNewFiles]);
  }

  /**
   * Elimina el archivo con identificador {@link key} de la
   * lista de archivos a enviar en el formulario
   * @param {string} key - Identificador del archivo a eliminar dentro del input del formulario
   */
  function handleRemove(key) {
    syncInputFiles(files.filter((file) => fileKey(file) !== key));
  }

  /**
   * Añade a la lista de archivos a enviar en el formulario
   * cada vez que detecta un evento en el que se suben archivos
   * nuevos
   * @param {Event} event - Evento que recoge nuevos archivos subidos al input
   */
  function handleChange(event) {
    addFiles(Array.from(event.target.files ?? []));
  }

  /**
   * Maneja el evento disparado al arrastrar un archivo sobre el
   * input para que interactue con el input en lugar de abrirse
   * en una nueva ventana del navegador
   * @param {Event} event - Evento disparado al arrastrar un archivo sobre el input
   */
  function handleDragOver(event) {
    event.preventDefault();
    setIsDraggingOver(true);
  }

  /**
   * Maneja el evento disparado al arrastrar un archivo hacia
   * afuera del input para evitar subir archivos incorrectos
   */
  function handleDragLeave() {
    setIsDraggingOver(false);
  }

  /**
   * Maneja el evento disparado al soltar un archivo sobre el
   * input para que se suba al formulario en lugar de abrirse en
   * una nueva ventana del navegador
   * @param {Event} event - Evento disparado al soltar un archivo sobre el input
   */
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

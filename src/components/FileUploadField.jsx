"use client";

import { useState } from "react";

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-indigo-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}

export function FileUploadField({ id = "files", name = "files" }) {
  const [files, setFiles] = useState([]);

  function handleChange(event) {
    setFiles(Array.from(event.target.files ?? []));
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/40"
      >
        <UploadIcon />
        <span className="text-sm font-medium text-slate-700">
          Haz clic para elegir archivo(s)
        </span>
        <span className="text-xs text-slate-400">PDF, TXT o MD</span>

        <input
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
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <FileIcon />
              <span className="truncate">{file.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

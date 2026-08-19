"use client";

import { Alert } from "@/components/Alert";

function UserForm({ submitAction, isLogin, type, message }) {
  return (
    <>
      <Alert type={type} message={message} />

      <form action={submitAction} className="flex flex-col gap-3 mt-4">
        <label htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            required
            className="block w-full"
          />
        </label>

        <label htmlFor="password">
          Contraseña
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="block w-full"
          />
        </label>

        <button type="submit">{isLogin ? "Entrar" : "Registrarme"}</button>
      </form>
    </>
  );
}

export default UserForm;

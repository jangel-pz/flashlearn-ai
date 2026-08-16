"use client";

function UserForm({ submitAction, isLogin }) {
  return (
    <form action={submitAction} className="flex flex-col gap-3">
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
  );
}

export default UserForm;

"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm({ withEmail }: { withEmail: boolean }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="card">
      {withEmail ? (
        <div className="field">
          <label className="field-label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoFocus
            required
            autoComplete="username"
          />
        </div>
      ) : null}
      <div className="field">
        <label className="field-label" htmlFor="password">
          {withEmail ? "Senha" : "Senha do editor"}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus={!withEmail}
          required
          autoComplete="current-password"
        />
      </div>
      {state.error ? <p className="error">{state.error}</p> : null}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

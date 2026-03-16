import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const initialForm = {
  name: '',
  email: '',
  password: ''
};

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'signup') {
        await signup(form);
      } else {
        await login({
          email: form.email,
          password: form.password
        });
      }
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError.details?.join(' ') || submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
  }

  return (
    <div className="auth-layout">
      <section className="auth-panel auth-intro">
        <span className="eyebrow">Private by default</span>
        <h1>Wishlist Orb</h1>
        <p>
          A personal wishlist designed as a floating constellation. Add products, track value, and
          keep the entire experience scoped to your account.
        </p>
        <div className="intro-card">
          <p>Planned next:</p>
          <ul>
            <li>Public or private orb visibility controls</li>
            <li>Friend viewing and shared links</li>
            <li>Selective sharing without changing the core data model</li>
          </ul>
        </div>
      </section>

      <section className="auth-panel auth-form-panel">
        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => switchMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => switchMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{mode === 'signup' ? 'Create your private orb' : 'Welcome back'}</h2>

          {mode === 'signup' && (
            <label>
              <span>Name</span>
              <input
                name="name"
                type="text"
                placeholder="Ava Parker"
                value={form.name}
                onChange={updateField}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={updateField}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
            />
          </label>

          {error ? <div className="form-error">{error}</div> : null}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>
      </section>
    </div>
  );
}


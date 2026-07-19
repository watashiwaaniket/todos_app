export function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-shell__visual" aria-hidden="true">
        <img
          src="/authWallpaper.png"
          alt=""
          className="auth-shell__image"
        />
        <div className="auth-shell__overlay">
          <p className="auth-shell__brand">Your To Do</p>
          <p className="auth-shell__tagline">
            Capture what matters. Finish what counts.
          </p>
        </div>
      </aside>
      <section className="auth-shell__panel">
        <div className="auth-shell__form-wrap">{children}</div>
      </section>
    </div>
  )
}

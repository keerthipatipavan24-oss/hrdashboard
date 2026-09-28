import "./Header.css";

export default function Header({ pageName = "Dashboard" }) {
  return (
    <header className="app-header">

      <div className="header-left">

        <div className="header-brand">
          HR PORTAL
        </div>

        <div className="header-divider">
          /
        </div>

        <div className="header-page">
          {pageName}
        </div>

      </div>

      <div className="header-right">

        <div className="header-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Find employees, reports..."
          />

        </div>

        <button className="header-action">
          ⌁
        </button>

        <div className="header-avatar">
          PV
        </div>

      </div>

    </header>
  );
} 
import React from "react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="app-header">
      <a className="app-header__logo" href="index.html">
        Vali
      </a>
      <a
        className="app-sidebar__toggle"
        data-toggle="sidebar"
        aria-label="Hide Sidebar"
        onClick={toggleSidebar}
      ></a>
      <ul className="app-nav">
        <li className="app-search">
          <input
            className="app-search__input"
            type="search"
            placeholder="Search"
          />
          <button className="app-search__button">
            <i className="bi bi-search"></i>
          </button>
        </li>
        <li className="dropdown">
          <a
            className="app-nav__item"
            href="#"
            data-bs-toggle="dropdown"
            aria-label="Show notifications"
          >
            <i className="bi bi-bell fs-5"></i>
          </a>
          <ul className="app-notification dropdown-menu dropdown-menu-right">
            <li className="app-notification__title">
              You have 4 new notifications.
            </li>
            <div className="app-notification__content">
              <li>
                <a className="app-notification__item" href="#">
                  <span className="app-notification__icon">
                    <i className="bi bi-envelope fs-4 text-primary"></i>
                  </span>
                  <div>
                    <p className="app-notification__message">
                      Lisa sent you a mail
                    </p>
                    <p className="app-notification__meta">2 min ago</p>
                  </div>
                </a>
              </li>
              <li>
                <a className="app-notification__item" href="#">
                  <span className="app-notification__icon">
                    <i className="bi bi-exclamation-triangle fs-4 text-warning"></i>
                  </span>
                  <div>
                    <p className="app-notification__message">
                      Mail server not working
                    </p>
                    <p className="app-notification__meta">5 min ago</p>
                  </div>
                </a>
              </li>
              <li>
                <a className="app-notification__item" href="#">
                  <span className="app-notification__icon">
                    <i className="bi bi-cash fs-4 text-success"></i>
                  </span>
                  <div>
                    <p className="app-notification__message">
                      Transaction complete
                    </p>
                    <p className="app-notification__meta">2 days ago</p>
                  </div>
                </a>
              </li>
              <li>
                <a className="app-notification__item" href="#">
                  <span className="app-notification__icon">
                    <i className="bi bi-envelope fs-4 text-primary"></i>
                  </span>
                  <div>
                    <p className="app-notification__message">
                      Lisa sent you a mail
                    </p>
                    <p className="app-notification__meta">2 min ago</p>
                  </div>
                </a>
              </li>
              <li>
                <a className="app-notification__item" href="#">
                  <span className="app-notification__icon">
                    <i className="bi bi-exclamation-triangle fs-4 text-warning"></i>
                  </span>
                  <div>
                    <p className="app-notification__message">
                      Mail server not working
                    </p>
                    <p className="app-notification__meta">5 min ago</p>
                  </div>
                </a>
              </li>
              <li>
                <a className="app-notification__item" href="#">
                  <span className="app-notification__icon">
                    <i className="bi bi-cash fs-4 text-success"></i>
                  </span>
                  <div>
                    <p className="app-notification__message">
                      Transaction complete
                    </p>
                    <p className="app-notification__meta">2 days ago</p>
                  </div>
                </a>
              </li>
            </div>
            <li className="app-notification__footer">
              <a href="#">See all notifications.</a>
            </li>
          </ul>
        </li>
        <li className="dropdown">
          <a
            className="app-nav__item"
            href="#"
            data-bs-toggle="dropdown"
            aria-label="Open Profile Menu"
          >
            <i className="bi bi-person fs-4"></i>
          </a>
          <ul className="dropdown-menu settings-menu dropdown-menu-right">
            <li>
              <a className="dropdown-item" href="page-user.html">
                <i className="bi bi-gear me-2 fs-5"></i> Settings
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="page-user.html">
                <i className="bi bi-person me-2 fs-5"></i> Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="page-login.html">
                <i className="bi bi-box-arrow-right me-2 fs-5"></i> Logout
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  );
};

export default Header;

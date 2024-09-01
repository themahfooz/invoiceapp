import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ activePage, isCollapsed }) => {
  const [expandedGroup, setExpandedGroup] = useState(null);

  const toggleExpand = (group) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  return (
    <>
      <div className="app-sidebar__overlay" data-toggle="sidebar"></div>
      <aside className={`app-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="app-sidebar__user">
          <img
            className="app-sidebar__user-avatar"
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="User Image"
            style={{
              width: isCollapsed ? "30px" : "45px",
              height: isCollapsed ? "30px" : "45px",
            }}
          />
          {!isCollapsed && (
            <div>
              <p className="app-sidebar__user-name">John Doe</p>
              <p className="app-sidebar__user-designation">
                Frontend Developer
              </p>
            </div>
          )}
        </div>
        <ul className="app-menu">
          {/* <li
            className={`treeview ${
              expandedGroup === "ui-elements" ? "is-expanded" : ""
            }`}
          >
            <a
              href="#"
              className="app-menu__item"
              onClick={() => toggleExpand("ui-elements")}
            >
              <i className="app-menu__icon bi bi-laptop"></i>
              {!isCollapsed && (
                <span className="app-menu__label">UI Elements</span>
              )}
              {!isCollapsed && (
                <i className="treeview-indicator bi bi-chevron-right"></i>
              )}
            </a>
            <ul
              className={`treeview-menu ${
                expandedGroup === "ui-elements" ? "show" : ""
              }`}
            >
              <li>
                <Link
                  to="/bootstrap-components"
                  className={`treeview-item ${
                    activePage === "ui-bootstrap" ? "active" : ""
                  }`}
                >
                  <i className="icon bi bi-circle-fill"></i>
                  {!isCollapsed && "Bootstrap Elements"}
                </Link>
              </li>
              <li>
                <a
                  href="https://icons.getbootstrap.com/"
                  className="treeview-item"
                  target="_blank"
                  rel="noopener"
                >
                  <i className="icon bi bi-circle-fill"></i>
                  {!isCollapsed && "Font Icons"}
                </a>
              </li>
              <li>
                <Link
                  to="/ui-cards"
                  className={`treeview-item ${
                    activePage === "ui-cards" ? "active" : ""
                  }`}
                >
                  <i className="icon bi bi-circle-fill"></i>
                  {!isCollapsed && "Cards"}
                </Link>
              </li>
              <li>
                <Link
                  to="/widgets"
                  className={`treeview-item ${
                    activePage === "ui-widgets" ? "active" : ""
                  }`}
                >
                  <i className="icon bi bi-circle-fill"></i>
                  {!isCollapsed && "Widgets"}
                </Link>
              </li>
            </ul>
          </li> */}

          {/* <li
            className={`treeview ${
              expandedGroup === "forms" ? "is-expanded" : ""
            }`}
          >
            <a
              href="#"
              className="app-menu__item"
              onClick={() => toggleExpand("forms")}
            >
              <i className="app-menu__icon bi bi-ui-checks" />
              {!isCollapsed && <span className="app-menu__label">Forms</span>}
              {!isCollapsed && (
                <i className="treeview-indicator bi bi-chevron-right" />
              )}
            </a>
            <ul
              className={`treeview-menu ${
                expandedGroup === "forms" ? "show" : ""
              }`}
            >
              <li>
                <Link
                  to="/form-components"
                  className={`treeview-item ${
                    activePage === "form-components" ? "active" : ""
                  }`}
                >
                  <i className="icon bi bi-circle-fill"></i>
                  {!isCollapsed && "Form Components"}
                </Link>
              </li>
              <li>
                <Link
                  to="/form-validation"
                  className={`treeview-item ${
                    activePage === "form-validation" ? "active" : ""
                  }`}
                >
                  <i className="icon bi bi-circle-fill"></i>
                  {!isCollapsed && "Form Validation"}
                </Link>
              </li>
            </ul>
          </li> */}

          <li>
            <Link
              to="/"
              className={`app-menu__item ${
                activePage === "home" ? "active" : ""
              }`}
            >
              <i className="app-menu__icon bi bi-house-door-fill"></i>
              {!isCollapsed && <span className="app-menu__label">Home</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/invoice"
              className={`app-menu__item ${
                activePage === "invoice" ? "active" : ""
              }`}
            >
              <i className="app-menu__icon bi bi-file-text"></i>
              {!isCollapsed && <span className="app-menu__label">Invoice</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/product"
              className={`app-menu__item ${
                activePage === "product" ? "active" : ""
              }`}
            >
              <i className="app-menu__icon bi bi-box"></i>
              {!isCollapsed && <span className="app-menu__label">Product</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/stock"
              className={`app-menu__item ${
                activePage === "stock" ? "active" : ""
              }`}
            >
              <i className="app-menu__icon bi bi-file-earmark-plus"></i>
              {!isCollapsed && (
                <span className="app-menu__label">Stock Entry</span>
              )}
            </Link>
          </li>

          <li>
            <Link
              to="/customer"
              className={`app-menu__item ${
                activePage === "customer" ? "active" : ""
              }`}
            >
              <i className="app-menu__icon bi bi-people-fill"></i>
              {!isCollapsed && (
                <span className="app-menu__label">Customer</span>
              )}
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;

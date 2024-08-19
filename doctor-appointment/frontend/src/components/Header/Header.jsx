import logo from "../../assets/images/logo5.png";
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { useContext, useEffect, useRef } from "react";

import { AuthContext } from "./../../context/AuthContext";

const Header = () => {
  const { user, token, role } = useContext(AuthContext);

  const headerRef = useRef(null);
  const menuRef = useRef(null);

  const stickyHeaderFunc = () => {
    if (headerRef.current) {
      window.addEventListener("scroll", () => {
        if (
          document.body.scrollTop > 80 ||
          document.documentElement.scrollTop > 80
        ) {
          headerRef.current.classList.add("sticky__header");
        } else {
          headerRef.current.classList.remove("sticky__header");
        }
      });
    }
  };

  useEffect(() => {
    stickyHeaderFunc();

    return () => {
      if (headerRef.current) {
        window.removeEventListener("scroll", stickyHeaderFunc);
      }
    };
  }, []);

  const toggleMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle("show__menu");
    }
  };

  const navLinks = [
    {
      path: "/home",
      display: "Home",
    },
    {
      path: "/services",
      display: "Services",
    },
    {
      path: "/doctors",
      display: "Find a Doctor",
    },
    {
      path: "/contact",
      display: "Contact",
    },
    {
      path: "/prediction",
      display: "Prediction",
    },
    {
      path: "/covid",
      display: "Covid/Glaucoma",
    },
    {
      path: "/ManageHospitals",
      display: "Manage Hospitals",
    },
  ];

  return (
    <header ref={headerRef} className="header flex items-center">
      <div className="container">
        <div className="flex items-center justify-between">
          {/* =========== logo ========== */}
          <div>
            <img src={logo} alt="logo" />
          </div>

          {/* ========== nav menu =========== */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-[#0067FF] font-[600] text-[16px] leading-7"
                        : "text-textColor font-[500] text-[16px] leading-7"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ========= nav right ========== */}
          <div className="flex items-center gap-4">
            {token && user ? (
              <div>
                <Link
                  to={`${
                    role === "doctor"
                      ? "/doctors/profile/me"
                      : role === "nurse"
                      ? "/nurses/profile/me"
                      : role === "admin"
                      ? "/admins/profile/me" // Admin profile link
                      : "/users/profile/me"
                  } `}
                >
                  <figure className="w-[35px] h-[35px] rounded-full cursor-pointer ">
                    <img
                      className="w-full rounded-full"
                      src={user?.photo}
                      alt=""
                    />
                  </figure>
                </Link>
              </div>
            ) : (
              role === "admin" && ( // Only show login if the user is admin and not logged in
                <Link to="/login">
                  <button className="bg-buttonBgColor py-2 px-6 rounded-[50px] text-white font-[600] h-[44px] flex items-center justify-center">
                    Log In
                  </button>
                </Link>
              )
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
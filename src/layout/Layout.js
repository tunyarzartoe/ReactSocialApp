import React from "react";
import { Outlet } from "react-router";
import Footer from "./Footer";
import MainNavbar from "./MainNavbar";

const Layout = () => {
  return (
    <>
      <MainNavbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;

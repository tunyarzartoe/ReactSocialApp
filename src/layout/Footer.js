import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <span>
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/tunyarzartoe"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tun Yar Zar Toe
        </a>
        . All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;

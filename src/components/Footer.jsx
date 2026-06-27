import React from "react";

export default function Footer(){
  return (
    <footer className="site-footer text-center">
      <div className="container">
        <p className="mb-0">© {new Date().getFullYear()} HighDep — كل الحقوق محفوظة</p>
      </div>
    </footer>
  );
}

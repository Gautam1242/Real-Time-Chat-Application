import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1">&copy; {new Date().getFullYear()} Task Manager . All rights reserved.</p>
        <div className="d-flex justify-content-center gap-3">
          <a href="#" className="text-white text-decoration-none">Privacy Policy</a>
          <a href="#" className="text-white text-decoration-none">Terms of Service</a>
          <a href="#" className="text-white text-decoration-none">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

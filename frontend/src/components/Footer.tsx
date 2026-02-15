// src/components/Footer.tsx
import React from "react";
import logoPutih from "../assets/logoPutih.png";
import garisFooter from "../assets/garisFooter.png";
import igLogo from "../assets/IGlogo.png";
import faceBookLogo from "../assets/facebookLogo.png";
import emailLogo from "../assets/emailLogo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#22543d] text-white py-8 px-6 flex flex-col mt-10">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-32">
        {/* Logo and Line */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <img
            src={logoPutih}
            alt="BizBridge Logo"
            className="w-60 object-contain"
          />
          <img
            src={garisFooter}
            alt="Divider line"
            className="h-60 hidden md:block"
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4 text-lg">
          <a
            href="#"
            className="flex items-center gap-3 hover:text-gray-300 transition-colors"
          >
            <img
              src={igLogo}
              alt="Instagram"
              className="w-6 h-6 object-contain"
            />
            BizBridgeCorp
          </a>
          <a
            href="#"
            className="flex items-center gap-3 hover:text-gray-300 transition-colors"
          >
            <img
              src={faceBookLogo}
              alt="Facebook"
              className="w-6 h-6 object-contain"
            />
            info@bizbridge.com
          </a>
          <a
            href="#"
            className="flex items-center gap-3 hover:text-gray-300 transition-colors"
          >
            <img
              src={emailLogo}
              alt="Website"
              className="w-6 h-6 object-contain"
            />
            www.bizbridgeglobal.com
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-sm mt-8">
        © 2025 BizBridgeCorp. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

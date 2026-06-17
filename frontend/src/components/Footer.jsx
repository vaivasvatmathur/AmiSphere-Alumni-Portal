import { FOOTER_TEXT } from "../constants/branding.js";

const Footer = ({ className = "" }) => {
  return (
    <footer className={`border-t border-slate-200 py-4 text-center text-xs font-medium text-slate-500 ${className}`}>
      {FOOTER_TEXT}
    </footer>
  );
};

export default Footer;

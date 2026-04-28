import React from 'react';

export const Footer = () => {
  const cDate = new Date().getFullYear();
  return (
    <footer className="border-t border-(--color-border-subtle) px-8 py-5 flex items-center justify-between">
      <span className="text-xs text-neutral-600">© {cDate} DoxCheck. All rights reserved.</span>
      <span className="text-xs text-neutral-600">Secure Document Authentication Platform</span>
    </footer>
  );
};

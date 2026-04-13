'use client';
import { useEffect } from 'react';

/** Disables right-click (context menu) and Ctrl+P / Cmd+P sitewide to deter casual content scraping. */
export default function NoRightClick() {
  useEffect(() => {
    const contextHandler = (e: MouseEvent) => e.preventDefault();
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') e.preventDefault();
    };
    document.addEventListener('contextmenu', contextHandler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('contextmenu', contextHandler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, []);
  return null;
}

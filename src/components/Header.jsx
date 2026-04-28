import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

export const Header = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-(--color-border-subtle)">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
          <span className="text-white font-bold text-xs" style={{ fontFamily: 'var(--font-display)' }}>DV</span>
        </div>
        <span className="font-bold text-neutral-100 tracking-tight" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
          DoxCheck
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* hide muna natin since wala naman talagang ganitong feature */}
        {/* <button
          onClick={() => navigate('/admin')}
          className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Admin Portal
        </button> */}

        <button
          onClick={toggleTheme}
          className="p-2 px-3 rounded-full border border-(--color-border-subtle) hover:border-(--color-border) transition-all text-neutral-400 hover:text-neutral-100"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
        </button>
      </div>
    </nav>
  );
};

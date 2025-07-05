import React from 'react';

const Header = () => {
  return (
    <header className="w-full bg-header-1 shadow-[0px_1px_3px_#00000019] p-4 sm:p-5 flex justify-center items-center">
      <div className="w-full max-w-7xl mx-auto flex justify-center items-center">
        <img 
          src="/images/img_header_logo.svg" 
          alt="SpaceX Logo" 
          className="w-[200px] h-[24px] sm:w-[260px] sm:h-[32px]"
        />
      </div>
    </header>
  );
};

export default Header;
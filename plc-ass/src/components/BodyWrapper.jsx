import React from 'react';

const BodyWrapper = ({children}) => {
  return (
      <div className="relative max-h-screen">
        <main className="w-full max-h-screen">{children}</main>
      </div>
  );
};

export default BodyWrapper;

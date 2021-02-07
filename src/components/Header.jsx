import React from 'react';

const Header = ({date}) => {
  return (
    <div>
      <h1 className='text-center text-warning mt-2 mb-3'>CryptoManiac</h1>
      <time>{date}</time>
    </div>
  );
};

export default Header;

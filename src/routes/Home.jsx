import React, { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');

  
  return (
    <div className='Home'>
      <div className='search-container'>
        <span> Nº resultados visibles: 100</span>
        <input type='search' value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
    </div>
  );
}

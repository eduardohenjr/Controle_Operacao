import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="centralizador-pagina">
      <button className="home-btn pesquisar">
        Pesquisar caixa
      </button>
      <button className="home-btn adicionar" onClick={() => navigate('/add')}>
        Adicionar caixa
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import './Home.css';
import logo from '../imgs/logo.png';

export default function Home() {
  const [cabos, setCabos] = useState([]); // [{furoId, cor, tipo, pontoExterno}]
  const [selecionandoFuro, setSelecionandoFuro] = useState(false);
  const [novoCaboCor, setNovoCaboCor] = useState('#000000');
  const [modalTipoCabo, setModalTipoCabo] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [modalRemover, setModalRemover] = useState(false);
  const [furoRemover, setFuroRemover] = useState(null);

  function handleAdicionarCabo() {
    setModalTipoCabo(true);
  }

  function handleSelecionarTipo(tipo) {
    setTipoSelecionado(tipo);
    setModalTipoCabo(false);
    setSelecionandoFuro(true);
  }

  function handleRemoverCaboFuro(furoId) {
    setFuroRemover(furoId);
    setModalRemover(true);
  }
  function confirmarRemocaoCabo() {
    setCabos(cabos.filter(c => c.furoId !== furoRemover));
    setModalRemover(false);
    setFuroRemover(null);
  }
  function cancelarRemocaoCabo() {
    setModalRemover(false);
    setFuroRemover(null);
  }

  function handleSelecionarFuro(furoId) {
    if (selecionandoFuro && tipoSelecionado) {
      // Só permite para furos circulares (não oval)
      const furo = FUROS.find(f => f.id === furoId && !f.oval);
      if (!furo) return;
      // Impede adicionar mais de um cabo no mesmo furo
      if (cabos.some(c => c.furoId === furoId)) return;
      // Calcula ponto externo igual ao ponto vermelho exibido
      let pontoExterno;
      if (furoId === 1 || furoId === 2) {
        pontoExterno = { x: furo.x - PONTO_AF_DIST - 85, y: furo.y };
      } else if (furoId === 3 || furoId === 4) {
        pontoExterno = { x: furo.x + PONTO_AF_DIST + 85, y: furo.y };
      }
      setCabos([...cabos, { furoId, cor: novoCaboCor, tipo: tipoSelecionado, pontoExterno }]);
      setSelecionandoFuro(false);
      setTipoSelecionado(null);
    }
  }

  return (
    <div className="centralizador-pagina">
      <div className="canvas-wrapper" style={{position: 'relative', paddingTop: 72, paddingBottom: 72}}>
        <nav className="menu-superior" style={{position: 'absolute', top: 0, left: 0, width: '100%', borderRadius: '16px 16px 0 0', margin: 0, justifyContent: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center'}}>
            <img src={logo} alt="Logo" style={{height: 38, marginRight: 50, marginLeft: -100}} />
            <input
              type="text"
              placeholder="Procurar caixa"
              style={{ width: 240, padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #bbb', fontSize: '1rem' }}
            />
            <button
              style={{marginLeft: 16, background: '#0d2346', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer', fontWeight: 600}}
            >
              Pesquisar
            </button>
          </div>
        </nav>
        {/* Aqui pode ser exibido o resultado da pesquisa, se desejar */}
      </div>
    </div>
  );
}

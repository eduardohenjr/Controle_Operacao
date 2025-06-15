import React, { useState } from 'react';
import { Stage, Layer, Circle, Ellipse, Line, Text, Group, Rect } from 'react-konva';
import './Home.css';
import logo from '../imgs/logo.png';

const CAIXA_CENTER = { x: 320, y: 125 };
const CAIXA_RADIUS = 120;
const FURO_RADIUS = 20;
const OVAL_RADIUS_X = 44;
const OVAL_RADIUS_Y = 22;
const FURO_MARGIN = 26; // margem interna para não encostar na borda
const PONTO_AF_DIST = 32; // afastamento horizontal dos pontos dos furos circulares
const TIPOS_CABO = ['144F', '96F', '72F', '48F', '36F', '24F', '12F', '4F'];
const FITAS_CORES = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ffffff', '#654321'];

// Mapeamento de altura por tipo de cabo
const ALTURA_CABO = {
  '144F': 36,
  '96F': 32,
  '72F': 28,
  '48F': 24,
  '36F': 20,
  '24F': 16,
  '12F': 12,
  '4F': 8,
};

// Calcula posições dinâmicas dos furos (exceto oval)
function getFuros() {
  // Nova ordem: D1 (posição de D2), D2 (posição de D1), D3 (posição de D4), D4 (posição de D3)
  const angulos = [165, 240, 300, 10]; // graus
  const labels = ['D1', 'D2', 'D3', 'D4'];
  const furosCirculares = angulos.map((deg, idx) => {
    const rad = (deg * Math.PI) / 180;
    const x = CAIXA_CENTER.x + (CAIXA_RADIUS - FURO_RADIUS - FURO_MARGIN) * Math.cos(rad);
    const y = CAIXA_CENTER.y + (CAIXA_RADIUS - FURO_RADIUS - FURO_MARGIN) * Math.sin(rad);
    return {
      id: idx + 1,
      x,
      y,
      label: labels[idx],
      oval: false,
    };
  });
  // Oval centralizado na parte inferior, mas dentro do círculo
  const ovalAngle = 90; // baixo
  const ovalRad = (ovalAngle * Math.PI) / 180;
  const ovalX = CAIXA_CENTER.x + (CAIXA_RADIUS - OVAL_RADIUS_Y - FURO_MARGIN) * Math.cos(ovalRad);
  const ovalY = CAIXA_CENTER.y + (CAIXA_RADIUS - OVAL_RADIUS_Y - FURO_MARGIN) * Math.sin(ovalRad);
  const ovalFuro = {
    id: 5,
    x: ovalX,
    y: ovalY,
    label: 'Oval',
    oval: true,
  };
  return [...furosCirculares, ovalFuro];
}

export default function Home() {
  const [cabos, setCabos] = useState([]); // [{furoId, cor, tipo, pontoExterno}]
  const [selecionandoFuro, setSelecionandoFuro] = useState(false);
  const [novoCaboCor, setNovoCaboCor] = useState('#000000');
  const [modalTipoCabo, setModalTipoCabo] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [modalRemover, setModalRemover] = useState(false);
  const [furoRemover, setFuroRemover] = useState(null);
  const [modalTipoPonto, setModalTipoPonto] = useState(false);
  const [modalEndereco, setModalEndereco] = useState(false);
  const [pontoSelecionado, setPontoSelecionado] = useState(null); // {furoId, lado}
  const [tipoPonto, setTipoPonto] = useState(null);
  const [enderecosPontos, setEnderecosPontos] = useState({}); // {pontoKey: endereco}
  const [inputEndereco, setInputEndereco] = useState('');
  const [modalEnderecoExibir, setModalEnderecoExibir] = useState(false);
  const [enderecoExibir, setEnderecoExibir] = useState('');
  const [modalEnderecoCaixa, setModalEnderecoCaixa] = useState(false);
  const [inputEnderecoCaixa, setInputEnderecoCaixa] = useState('');
  const [inputCoordCaixa, setInputCoordCaixa] = useState('');
  const [caixaExibir, setCaixaExibir] = useState(null); // {endereco, coord}
  const [modalNomePop, setModalNomePop] = useState(false);
  const [inputNomePop, setInputNomePop] = useState('');
  const [modalFitas, setModalFitas] = useState(false);
  const [caboSelecionado, setCaboSelecionado] = useState(null);
  const [fitasSelecionadas, setFitasSelecionadas] = useState([]);
  const FUROS = getFuros();

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
      // Só permite criar cabo se o ponto já tiver tipo atribuído
      const keyEsq = `${furoId}_esq`;
      const keyDir = `${furoId}_dir`;
      if (!enderecosPontos[keyEsq] && !enderecosPontos[keyDir]) {
        alert('Crie um ponto (cliente, caixa ou pop) antes de adicionar o cabo!');
        return;
      }
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

  function handleSelecionarPonto(furoId, lado) {
    setPontoSelecionado({ furoId, lado });
    setModalTipoPonto(true);
  }
  function handleEscolherTipoPonto(tipo) {
    setTipoPonto(tipo);
    setModalTipoPonto(false);
    if (tipo === 'cliente') {
      setModalEndereco(true);
    } else if (tipo === 'caixa') {
      setModalEnderecoCaixa(true);
    } else if (tipo === 'pop') {
      setModalNomePop(true);
    } else {
      setEnderecosPontos(prev => ({ ...prev, [pontoKey(pontoSelecionado)]: tipo }));
      setPontoSelecionado(null);
      setTipoPonto(null);
    }
  }
  function handleSalvarEndereco() {
    setEnderecosPontos(prev => ({ ...prev, [pontoKey(pontoSelecionado)]: inputEndereco }));
    setModalEndereco(false);
    setInputEndereco('');
    setPontoSelecionado(null);
    setTipoPonto(null);
  }
  function handleSalvarEnderecoCaixa() {
    setEnderecosPontos(prev => ({
      ...prev,
      [pontoKey(pontoSelecionado)]: {
        endereco: inputEnderecoCaixa,
        coord: inputCoordCaixa
      }
    }));
    setModalEnderecoCaixa(false);
    setInputEnderecoCaixa('');
    setInputCoordCaixa('');
    setPontoSelecionado(null);
    setTipoPonto(null);
  }
  function handleSalvarNomePop() {
    setEnderecosPontos(prev => ({ ...prev, [pontoKey(pontoSelecionado)]: { tipo: 'pop', nome: inputNomePop } }));
    setModalNomePop(false);
    setInputNomePop('');
    setPontoSelecionado(null);
    setTipoPonto(null);
  }
  function pontoKey(ponto) {
    return ponto ? `${ponto.furoId}_${ponto.lado}` : '';
  }

  // Ao clicar em um cabo, abrir modal de fitas
  function handleCaboClick(idx) {
    setCaboSelecionado(idx);
    setFitasSelecionadas(cabos[idx]?.fitas || []);
    setModalFitas(true);
  }
  function handleToggleFita(cor) {
    setFitasSelecionadas(prev => prev.includes(cor) ? prev.filter(f => f !== cor) : [...prev, cor]);
  }
  function handleSalvarFitas() {
    setCabos(prev => prev.map((c, i) => i === caboSelecionado ? { ...c, fitas: fitasSelecionadas } : c));
    setModalFitas(false);
    setCaboSelecionado(null);
    setFitasSelecionadas([]);
  }

  return (
    <div className="centralizador-pagina">
      <div className="canvas-wrapper" style={{position: 'relative', paddingTop: 72, paddingBottom: 72}}>
        <nav className="menu-superior" style={{position: 'absolute', top: 0, left: 0, width: '100%', borderRadius: '16px 16px 0 0', margin: 0, justifyContent: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center'}}>
            <img src={logo} alt="Logo" style={{height: 38, marginRight: 0, marginLeft: 0}} />
          </div>
        </nav>
        {/* Modal de seleção de tipo de cabo */}
        {modalTipoCabo && (
          <div className="modal-tipo-cabo">
            <div className="modal-tipo-cabo-content">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                <h3 style={{margin: 0}}>Selecione o tipo de cabo</h3>
                <button
                  style={{marginLeft: 24, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 0.5rem', fontSize: '0.8rem', cursor: 'pointer'}}
                  onClick={() => setModalTipoCabo(false)}
                >
                  Cancelar
                </button>
              </div>
              <div className="tipos-cabo-lista" style={{marginTop: 24}}>
                {TIPOS_CABO.map(tipo => (
                  <button key={tipo} onClick={() => handleSelecionarTipo(tipo)}>{tipo}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Modal de remoção de cabo */}
        {modalRemover && (
          <div className="modal-tipo-cabo">
            <div className="modal-tipo-cabo-content">
              <h3>Remover cabo?</h3>
              <div style={{display: 'flex', gap: 16, marginTop: 24}}>
                <button style={{background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}} onClick={confirmarRemocaoCabo}>Remover</button>
                <button style={{background: '#bbb', color: '#222', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}} onClick={cancelarRemocaoCabo}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de seleção do tipo de ponto */}
        {modalTipoPonto && (
          <div className="modal-tipo-cabo">
            <div className="modal-tipo-cabo-content">
              <h3>O que deseja atribuir ao ponto?</h3>
              <div style={{display: 'flex', gap: 16, marginTop: 24}}>
                <button onClick={() => handleEscolherTipoPonto('cliente')} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Cliente</button>
                <button onClick={() => handleEscolherTipoPonto('caixa')} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Caixa</button>
                <button onClick={() => handleEscolherTipoPonto('pop')} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>POP</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de endereço do cliente */}
        {modalEndereco && (
          <div className="modal-tipo-cabo">
            <div className="modal-tipo-cabo-content">
              <h3>Informe o endereço do cliente</h3>
              <input
                type="text"
                value={inputEndereco}
                onChange={e => setInputEndereco(e.target.value)}
                placeholder="Endereço"
                style={{width: 320, padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #bbb', fontSize: '1rem', marginTop: 16}}
              />
              <div style={{display: 'flex', gap: 16, marginTop: 24}}>
                <button onClick={handleSalvarEndereco} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Salvar</button>
                <button onClick={() => { setModalEndereco(false); setInputEndereco(''); setPontoSelecionado(null); setTipoPonto(null); }} style={{background: '#bbb', color: '#222', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de endereço da caixa */}
        {modalEnderecoCaixa && (
          <div className="modal-tipo-cabo">
            <div className="modal-tipo-cabo-content">
              <h3>Informe o endereço da caixa</h3>
              <input
                type="text"
                value={inputEnderecoCaixa}
                onChange={e => setInputEnderecoCaixa(e.target.value)}
                placeholder="Endereço"
                style={{width: 320, padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #bbb', fontSize: '1rem', marginTop: 16}}
              />
              <h3 style={{marginTop: 24}}>Informe a coordenada (latitude,longitude)</h3>
              <input
                type="text"
                value={inputCoordCaixa}
                onChange={e => setInputCoordCaixa(e.target.value)}
                placeholder="-23.123456,-43.123456"
                style={{width: 320, padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #bbb', fontSize: '1rem', marginTop: 8}}
              />
              <div style={{display: 'flex', gap: 16, marginTop: 24}}>
                <button onClick={handleSalvarEnderecoCaixa} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Salvar</button>
                <button onClick={() => { setModalEnderecoCaixa(false); setInputEnderecoCaixa(''); setInputCoordCaixa(''); setPontoSelecionado(null); setTipoPonto(null); }} style={{background: '#bbb', color: '#222', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de nome do POP */}
        {modalNomePop && (
          <div className="modal-tipo-cabo">
            <div className="modal-tipo-cabo-content">
              <h3>Informe o nome do POP</h3>
              <input
                type="text"
                value={inputNomePop}
                onChange={e => setInputNomePop(e.target.value)}
                placeholder="Nome do POP"
                style={{width: 320, padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #bbb', fontSize: '1rem', marginTop: 16}}
              />
              <div style={{display: 'flex', gap: 16, marginTop: 24}}>
                <button onClick={handleSalvarNomePop} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Salvar</button>
                <button onClick={() => { setModalNomePop(false); setInputNomePop(''); setPontoSelecionado(null); setTipoPonto(null); }} style={{background: '#bbb', color: '#222', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de exibição do endereço do ponto */}
        {modalEnderecoExibir && (
          <div className="modal-tipo-cabo">
            <div className="modal-tipo-cabo-content">
              {typeof enderecoExibir === 'object' && enderecoExibir.tipo === 'pop' ? (
                <>
                  <h3>Nome:</h3>
                  <div style={{margin: '24px 0', fontSize: '1.1rem', color: '#1976d2', fontWeight: 500}}>{enderecoExibir.nome}</div>
                </>
              ) : (
                <>
                  <h3>Endereço:</h3>
                  <div style={{margin: '24px 0', fontSize: '1.1rem', color: '#1976d2', fontWeight: 500}}>{enderecoExibir}</div>
                </>
              )}
              <button onClick={() => setModalEnderecoExibir(false)} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Fechar</button>
            </div>
          </div>
        )}
        {/* Modal de exibição da caixa */}
        {caixaExibir && (
          <div className="modal-tipo-cabo">
            <div className="modal-tipo-cabo-content">
              <h3>Endereço da caixa:</h3>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(caixaExibir.coord)}`} target="_blank" rel="noopener noreferrer" style={{color: '#1976d2', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'underline', margin: '24px 0', display: 'inline-block'}}>{caixaExibir.endereco}</a>
              <div style={{marginTop: 24}}>
                <button onClick={() => setCaixaExibir(null)} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Fechar</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de fitas de cores */}
        {modalFitas && (
          <div className="modal-tipo-cabo">
            <div className="modal-tipo-cabo-content">
              <h3>Selecione as fitas de cor</h3>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, margin: '24px 0'}}>
                {FITAS_CORES.map(cor => (
                  <div key={cor} onClick={() => handleToggleFita(cor)} style={{width: 32, height: 32, borderRadius: 8, background: cor, border: fitasSelecionadas.includes(cor) ? '3px solid #1976d2' : '2px solid #bbb', cursor: 'pointer', boxSizing: 'border-box'}} />
                ))}
              </div>
              <div style={{display: 'flex', gap: 16, marginBottom: 16}}>
                <button onClick={handleSalvarFitas} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Salvar</button>
                <button onClick={() => { setModalFitas(false); setCaboSelecionado(null); setFitasSelecionadas([]); }} style={{background: '#bbb', color: '#222', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Cancelar</button>
                <button onClick={() => { setFitasSelecionadas([]); }} style={{background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer'}}>Remover todas as fitas</button>
              </div>
            </div>
          </div>
        )}
        <div style={{position: 'absolute', left: 0, bottom: 0, width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: 24}}>
          <button onClick={handleAdicionarCabo} disabled={selecionandoFuro} style={{minWidth: 180, fontSize: '1.1rem', padding: '0.75rem 2rem', borderRadius: 8, background: '#222', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer'}}>
            Adicionar Cabo
          </button>
        </div>
        <Stage width={650} height={340} className="canvas-stage">
          <Layer>
            {/* Caixa circular */}
            <Circle
              x={CAIXA_CENTER.x}
              y={CAIXA_CENTER.y}
              radius={CAIXA_RADIUS}
              stroke="#007bff"
              strokeWidth={4}
              fill="#222"
            />
            {/* Cabos */}
            {cabos.map((cabo, idx) => {
              const furo = FUROS.find(f => f.id === cabo.furoId);
              if (!furo) return null;
              // Define altura do cabo conforme tipo
              const altura = ALTURA_CABO[cabo.tipo] || 16;
              return (
                <Line
                  key={idx}
                  points={[furo.x, furo.y, cabo.pontoExterno.x, cabo.pontoExterno.y]}
                  stroke={cabo.cor}
                  strokeWidth={altura}
                  lineCap="round"
                  shadowBlur={4}
                  onClick={() => handleCaboClick(idx)}
                />
              );
            })}
            {/* Furos */}
            {FUROS.map((furo, idx) => {
              // Verifica se há cabos neste furo
              const cabosNoFuro = cabos.filter(c => c.furoId === furo.id);
              const labelFuro = cabosNoFuro.length >= 1 ? cabosNoFuro[0].tipo : furo.label;
              const hasCabo = cabosNoFuro.length > 0;
              return (
                furo.oval ? (
                  <Group key={furo.id} onClick={() => {
                    if (hasCabo) {
                      handleRemoverCaboFuro(furo.id);
                      return;
                    }
                    // Permite até 2 cabos na oval
                    const cabosNaOval = cabos.filter(c => c.furoId === furo.id);
                    if (selecionandoFuro && tipoSelecionado && cabosNaOval.length < 2) {
                      // Se já existe um cabo, só permite inserir outro do mesmo tipo
                      if (cabosNaOval.length === 1 && cabosNaOval[0].tipo !== tipoSelecionado) return;
                      // Define pontoExterno: esquerda se for o primeiro, direita se for o segundo
                      const pontoExterno = cabosNaOval.length === 0
                        ? { x: furo.x - 50, y: furo.y + OVAL_RADIUS_Y + 70 }
                        : { x: furo.x + 50, y: furo.y + OVAL_RADIUS_Y + 70 };
                      setCabos([
                        ...cabos,
                        { furoId: furo.id, cor: novoCaboCor, tipo: tipoSelecionado, pontoExterno }
                      ]);
                      setSelecionandoFuro(false);
                      setTipoSelecionado(null);
                    }
                  }}>
                    <Ellipse
                      x={furo.x}
                      y={furo.y}
                      radiusX={OVAL_RADIUS_X}
                      radiusY={OVAL_RADIUS_Y}
                      fill={selecionandoFuro ? '#90caf9' : '#fff'}
                      stroke="#007bff"
                      strokeWidth={3}
                      shadowBlur={selecionandoFuro ? 8 : 0}
                      cursor={selecionandoFuro ? 'pointer' : 'default'}
                    />
                    <Text
                      text={labelFuro}
                      x={furo.x - 24}
                      y={furo.y - 8}
                      width={48}
                      align="center"
                      fontSize={13}
                      fill="#1976d2"
                    />
                    {/* Dois pontos abaixo do oval, afastados */}
                    <Circle
                      x={furo.x - 50}
                      y={furo.y + OVAL_RADIUS_Y + 70}
                      radius={7}
                      fill="#696969"
                      cursor="pointer"
                      onClick={e => {
                        e.cancelBubble = true;
                        const lado = 'esq';
                        const key = `${furo.id}_${lado}`;
                        if (enderecosPontos[key]) {
                          const valor = enderecosPontos[key];
                          if (typeof valor === 'string') {
                            setEnderecoExibir(valor);
                            setModalEnderecoExibir(true);
                          } else if (valor && valor.endereco && valor.coord) {
                            setCaixaExibir(valor);
                          } else if (typeof valor === 'object' && valor !== null && valor.tipo === 'pop' && valor.nome) {
                            setEnderecoExibir({ tipo: 'pop', nome: valor.nome });
                            setModalEnderecoExibir(true);
                          } else {
                            alert(valor);
                          }
                        } else {
                          handleSelecionarPonto(furo.id, lado);
                        }
                      }}
                    />
                    <Circle
                      x={furo.x + 50}
                      y={furo.y + OVAL_RADIUS_Y + 70}
                      radius={7}
                      fill="#696969"
                      cursor="pointer"
                      onClick={e => {
                        e.cancelBubble = true;
                        const lado = 'dir';
                        const key = `${furo.id}_${lado}`;
                        if (enderecosPontos[key]) {
                          const valor = enderecosPontos[key];
                          if (typeof valor === 'string') {
                            setEnderecoExibir(valor);
                            setModalEnderecoExibir(true);
                          } else if (valor && valor.endereco && valor.coord) {
                            setCaixaExibir(valor);
                          } else if (typeof valor === 'object' && valor !== null && valor.tipo === 'pop' && valor.nome) {
                            setEnderecoExibir({ tipo: 'pop', nome: valor.nome });
                            setModalEnderecoExibir(true);
                          } else {
                            alert(valor);
                          }
                        } else {
                          handleSelecionarPonto(furo.id, lado);
                        }
                      }}
                    />
                  </Group>
                ) : (
                  <Group key={furo.id} onClick={() => {
                    if (hasCabo) {
                      handleRemoverCaboFuro(furo.id);
                      return;
                    }
                    handleSelecionarFuro(furo.id);
                  }}>
                    <Circle
                      x={furo.x}
                      y={furo.y}
                      radius={FURO_RADIUS}
                      fill={selecionandoFuro ? '#90caf9' : '#fff'}
                      stroke="#007bff"
                      strokeWidth={3}
                      shadowBlur={selecionandoFuro ? 8 : 0}
                      cursor={selecionandoFuro ? 'pointer' : 'default'}
                    />
                    <Text
                      text={labelFuro}
                      x={furo.x - 16}
                      y={furo.y - 10}
                      width={32}
                      align="center"
                      fontSize={12}
                      fill="#1976d2"
                    />
                    {/* Ponto separado à esquerda para D1/D2, à direita para D3/D4 */}
                    <Circle
                      x={idx < 2 ? furo.x - PONTO_AF_DIST - 90 : furo.x + PONTO_AF_DIST + 90}
                      y={furo.y}
                      radius={7}
                      fill="#696969"
                      cursor="pointer"
                      onClick={e => {
                        e.cancelBubble = true;
                        const lado = idx < 2 ? 'esq' : 'dir';
                        const key = `${furo.id}_${lado}`;
                        if (enderecosPontos[key]) {
                          const valor = enderecosPontos[key];
                          if (typeof valor === 'string') {
                            setEnderecoExibir(valor);
                            setModalEnderecoExibir(true);
                          } else if (valor && typeof valor === 'object' && valor.endereco && valor.coord) {
                            setCaixaExibir(valor);
                          } else if (typeof valor === 'object' && valor !== null && valor.tipo === 'pop' && valor.nome) {
                            setEnderecoExibir({ tipo: 'pop', nome: valor.nome });
                            setModalEnderecoExibir(true);
                          } else {
                            alert(valor);
                          }
                        } else {
                          handleSelecionarPonto(furo.id, lado);
                        }
                      }}
                    />
                  </Group>
                )
              );
            })}
            {/* Exibir fitas sobre o cabo, agora no meio do cabo */}
            {cabos.map((cabo, idx) => {
              const furo = FUROS.find(f => f.id === cabo.furoId);
              if (!furo) return null;
              const altura = ALTURA_CABO[cabo.tipo] || 16;
              if (!cabo.fitas) return null;
              // Posição central do cabo
              const midX = (furo.x + cabo.pontoExterno.x - 6) / 2;
              const midY = (furo.y + cabo.pontoExterno.y) / 2;
              return cabo.fitas.map((cor, i) => (
                <Rect
                  key={cor}
                  x={midX + (i * 12) - ((cabo.fitas.length-1) * 6)}
                  y={midY - 10 }
                  width={10}
                  height={20}
                  fill={cor}
                  stroke="#222"
                  strokeWidth={1}
                  cornerRadius={2}
                />
              ));
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

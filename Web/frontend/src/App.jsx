import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [quantidade, setQuantidade] = useState(1);
  const [itensPedido, setItensPedido] = useState([]);
  
  // Limite disponível para o cliente selecionado, separado do limite original
  const [limiteCreditoDisponivel, setLimiteCreditoDisponivel] = useState(null);

  const [nome, setNome] = useState('');
  const [limiteCredito, setLimiteCredito] = useState('');

  // Quando trocar de cliente, atualiza limite disponível e reseta itens e seleção
  useEffect(() => {
    if (clienteSelecionado) {
      const cliente = clientes.find(c => c.id === parseInt(clienteSelecionado));
      if (cliente) {
        setLimiteCreditoDisponivel(cliente.limiteCredito);
      } else {
        setLimiteCreditoDisponivel(null);
      }
    } else {
      setLimiteCreditoDisponivel(null);
    }
    setItensPedido([]);
    setProdutoSelecionado(null);
    setQuantidade(1);
  }, [clienteSelecionado, clientes]);

  useEffect(() => {
    fetch('http://localhost:8080/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error('Erro ao buscar clientes', err));

    fetch('http://localhost:8080/api/produtos')
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }, []);

  const abrirModal = () => setModalOpen(true);
  const fecharModal = () => setModalOpen(false);

  const SalvaPedido = () => {
    if (!clienteSelecionado) {
      toast.error('Selecione um cliente antes de salvar o pedido.');
      return;
    }
    if (itensPedido.length === 0) {
      toast.error('Adicione ao menos um item ao pedido.');
      return;
    }

    const cliente = clientes.find(c => c.id === parseInt(clienteSelecionado));
    if (!cliente) {
      toast.error('Cliente selecionado inválido.');
      return;
    }

    const totalPedido = itensPedido.reduce((acc, item) => acc + item.subtotal, 0);

    const pedido = {
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        limiteCredito: cliente.limiteCredito // valor original do backend
      },
      dataPedido: new Date().toISOString().split('T')[0], 
      valorTotal: totalPedido,
      status: "PENDENTE",
      itens: itensPedido.map(item => ({
        produto: { id: item.produto.id, nome: item.produto.nome, preco: item.produto.preco },
        quantidade: item.quantidade,
        subtotal: item.subtotal
      }))
    };

    fetch('http://localhost:8080/api/pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    })
    .then(data => {
      toast.success('Pedido salvo com sucesso!');
      setItensPedido([]);
      setClienteSelecionado(null);
      setProdutoSelecionado(null);
      setQuantidade(1);
      setLimiteCreditoDisponivel(null);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    })
      .catch(err => {
        toast.error(`Erro ao salvar pedido: ${err.message}`);
        console.error(err);
      });
  };

  const adicionarItem = () => {
    if (!produtoSelecionado || quantidade < 1 || !clienteSelecionado) return;

    const produto = produtos.find(p => p.id === parseInt(produtoSelecionado));
    if (!produto) return;

    const subtotal = produto.preco * quantidade;

    if (limiteCreditoDisponivel === null || limiteCreditoDisponivel < subtotal) {
      toast.error('Crédito insuficiente para adicionar este item.');
      return;
    }

    // Atualiza limite disponível, sem alterar o limite original do cliente
    setLimiteCreditoDisponivel(prev => prev - subtotal);

    setItensPedido([...itensPedido, { produto, quantidade, subtotal }]);
    setProdutoSelecionado(null);
    setQuantidade(1);
  };

  const removerItem = (index) => {
    const novosItens = [...itensPedido];
    const itemRemovido = novosItens.splice(index, 1)[0];
    setItensPedido(novosItens);

    setLimiteCreditoDisponivel(prev => prev + itemRemovido.subtotal);
  };

  const totalPedido = itensPedido.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmitCliente = (e) => {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error('Por favor, preencha o nome do cliente.');
      return;
    }

    if (!limiteCredito || isNaN(parseFloat(limiteCredito)) || parseFloat(limiteCredito) <= 0) {
      toast.error('Por favor, informe um limite de crédito válido maior que zero.');
      return;
    }
    const novoCliente = {
      nome,
      limiteCredito: parseFloat(limiteCredito)
    };

    fetch('http://localhost:8080/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCliente)
    })
      .then(res => res.json())
      .then(clienteCriado => {
        setClientes([...clientes, clienteCriado]);
        setNome('');
        setLimiteCredito('');
        fecharModal();
      })
      .catch(err => {
        alert('Erro ao cadastrar cliente');
        console.error(err);
      });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div style={{
        padding: '20px',
        width: '440px',
        margin: '0 auto',
        marginTop: '50px',
        backgroundColor: '#f0f4ff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ position: 'fixed', top: 10, right: 10 }}>
          <button onClick={abrirModal}>Cadastrar Cliente</button>
        </div>

        <h2>Novo Pedido</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label>Cliente:</label><br />
          <select
            value={clienteSelecionado || ''}
            onChange={(e) => setClienteSelecionado(e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1.5px solid #4a90e2',
              backgroundColor: '#fff',
              fontSize: '12px',
              color: '#333',
              outline: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.3s',
            }}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>

          {clienteSelecionado && (
            <div>
              <strong>Limite de Crédito disponível:</strong> R$
              {limiteCreditoDisponivel?.toFixed(2)}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Produto:</label><br />
          <select
            value={produtoSelecionado || ''}
            onChange={(e) => setProdutoSelecionado(e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1.5px solid #4a90e2',
              backgroundColor: '#fff',
              fontSize: '12px',
              color: '#333',
              outline: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.3s',
            }}
          >
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          {produtoSelecionado && (
            <div>
              <strong>Preço:</strong> R$
              {produtos.find(p => p.id === parseInt(produtoSelecionado))?.preco}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Quantidade:</label><br />
          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          /><br /><br />
          <button onClick={adicionarItem}>Adicionar Item</button>
        </div>

        <h3>Itens do Pedido</h3>
        <ul>
          {itensPedido.map((item, index) => (
            <li key={index}>
              {item.produto.nome} - {item.quantidade} x R${item.produto.preco} ={' '}
              <strong>R${item.subtotal}</strong>{' '}
              <button onClick={() => removerItem(index)}>Remover</button>
            </li>
          ))}
        </ul>

        <h4>Total do Pedido: R${totalPedido}</h4>
        <button onClick={SalvaPedido}>Salvar Pedido</button>

        {modalOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h2>Cadastrar Cliente</h2>
              <form onSubmit={handleSubmitCliente}>
                <div style={styles.formGroup}>
                  <label>Nome:</label><br />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Limite de Crédito:</label><br />
                  <input
                    type="number"
                    step="0.01"
                    value={limiteCredito}
                    onChange={(e) => setLimiteCredito(e.target.value)}
                    required
                  />
                </div>
                <div style={styles.botoes}>
                  <button type="submit">Salvar</button>
                  <button type="button" onClick={fecharModal}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    minWidth: 300,
  },
  formGroup: {
    marginBottom: 12,
  },
  botoes: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
  }
};

export default App;

/**
 * ==============================================================================
 * GESTÃO DE MARCAS DE MAQUIAGEM - FRONTEND EM JAVASCRIPT PURO (ES6+)
 * Integração completa com API RESTful Spring Boot (http://localhost:8080/marca)
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. CONSTANTES E CONFIGURAÇÃO DA API
// ------------------------------------------------------------------------------
const API_BASE_URL = 'http://localhost:8080/marca';

// Guarda a marca atualmente carregada no card para edições/exclusões rápidas
let marcaAtual = null;
let marcaParaExcluir = null;

// ------------------------------------------------------------------------------
// 2. REFERÊNCIAS AOS ELEMENTOS DO DOM
// ------------------------------------------------------------------------------
const elements = {
  // Widget de Status da API
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  btnCheckApi: document.getElementById('btnCheckApi'),

  // Formulário de Cadastro (POST)
  formCadastro: document.getElementById('formCadastro'),
  cadNome: document.getElementById('cadNome'),
  cadAno: document.getElementById('cadAno'),
  cadPais: document.getElementById('cadPais'),
  cadCrueltyFree: document.getElementById('cadCrueltyFree'),
  btnSubmitCadastro: document.getElementById('btnSubmitCadastro'),
  btnLimparCadastro: document.getElementById('btnLimparCadastro'),

  // Busca e Visualização (GET)
  formBusca: document.getElementById('formBusca'),
  inputBuscaNome: document.getElementById('inputBuscaNome'),
  btnBuscar: document.getElementById('btnBuscar'),
  estadoVazio: document.getElementById('estadoVazio'),
  estadoCarregando: document.getElementById('estadoCarregando'),
  cardMarca: document.getElementById('cardMarca'),

  // Elementos do Card da Marca
  cardMarcaId: document.getElementById('cardMarcaId'),
  cardMarcaNome: document.getElementById('cardMarcaNome'),
  cardMarcaBadgeCruelty: document.getElementById('cardMarcaBadgeCruelty'),
  cardMarcaAno: document.getElementById('cardMarcaAno'),
  cardMarcaPais: document.getElementById('cardMarcaPais'),
  btnCardEditar: document.getElementById('btnCardEditar'),
  btnCardExcluir: document.getElementById('btnCardExcluir'),
  btnCardLimpar: document.getElementById('btnCardLimpar'),

  // Modal de Edição (PUT)
  modalEdicao: document.getElementById('modalEdicao'),
  formEdicao: document.getElementById('formEdicao'),
  editMarcaId: document.getElementById('editMarcaId'),
  editMarcaIdDisplay: document.getElementById('editMarcaIdDisplay'),
  editNome: document.getElementById('editNome'),
  editAno: document.getElementById('editAno'),
  editPais: document.getElementById('editPais'),
  editCrueltyFree: document.getElementById('editCrueltyFree'),
  btnFecharModalEdicao: document.getElementById('btnFecharModalEdicao'),
  btnCancelarEdicao: document.getElementById('btnCancelarEdicao'),
  btnSalvarEdicao: document.getElementById('btnSalvarEdicao'),

  // Modal de Confirmação de Exclusão (DELETE)
  modalExclusao: document.getElementById('modalExclusao'),
  exclusaoNomeMarca: document.getElementById('exclusaoNomeMarca'),
  btnCancelarExclusao: document.getElementById('btnCancelarExclusao'),
  btnConfirmarExclusao: document.getElementById('btnConfirmarExclusao'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer')
};

// ------------------------------------------------------------------------------
// 3. SISTEMA DE FEEDBACK VISUAL (TOAST NOTIFICATIONS)
// ------------------------------------------------------------------------------
const TOAST_DEFAULT_DURATION = 3500; // Duração exata de 3,5 segundos (3500ms)

/**
 * Exibe uma mensagem flutuante (Toast) estilizada para o usuário.
 * Cada notificação desaparece automaticamente após 3,5 segundos usando setTimeout,
 * além de permitir o fechamento manual a qualquer momento ao clicar no botão "×".
 * 
 * @param {string} title - Título curto do alerta (ex: "Sucesso!", "Erro")
 * @param {string} message - Descrição detalhada da notificação
 * @param {'success'|'error'|'warning'|'info'} type - Categoria do toast
 * @param {number} duration - Tempo de exibição em milissegundos (padrão: 3500ms / 3,5s)
 */
function showToast(title, message, type = 'info', duration = TOAST_DEFAULT_DURATION) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  // Ícones SVG contextuais para cada tipo de notificação
  let iconSvg = '';
  switch (type) {
    case 'success':
      iconSvg = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>`;
      break;
    case 'error':
      iconSvg = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>`;
      break;
    case 'warning':
      iconSvg = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`;
      break;
    default:
      iconSvg = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button type="button" class="toast-close" title="Fechar notificação" aria-label="Fechar notificação">&times;</button>
    <div class="toast-progress-bar" aria-hidden="true"></div>
  `;

  // Função para fechar e remover a notificação suavemente
  function fecharToast(t) {
    if (!t || t.classList.contains('toast-hiding')) return;
    clearTimeout(autoDismiss);
    t.classList.add('toast-hiding');
    t.addEventListener('transitionend', () => {
      t.remove();
    }, { once: true });

    // Fallback de segurança para garantir remoção do elemento
    setTimeout(() => {
      if (t.parentElement) {
        t.remove();
      }
    }, 400);
  }

  // Fechamento manual ao clicar no botão "×"
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    fecharToast(toast);
  });

  // Anexa o toast ao container na tela
  elements.toastContainer.appendChild(toast);

  // Auto-fechamento após 3,5 segundos (3500ms) usando setTimeout
  const autoDismiss = setTimeout(() => {
    fecharToast(toast);
  }, duration);
}

/**
 * Função utilitária para sanitização simples de HTML e prevenção de XSS
 */
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ------------------------------------------------------------------------------
// 4. VERIFICAÇÃO DE STATUS DA API (HEALTH-CHECK VISUAL)
// ------------------------------------------------------------------------------
/**
 * Realiza uma checagem rápida no servidor Spring Boot local.
 * Como o backend roda em localhost:8080/marca, uma chamada fetch avalia se o
 * servidor está online (se responder com qualquer status HTTP) ou offline (NetworkError).
 */
async function verificarStatusApi() {
  elements.statusDot.className = 'status-indicator-dot checking';
  elements.statusText.textContent = 'Verificando...';

  try {
    // Faz uma requisição leve de teste com timeout curto
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    // O GET na raiz /marca?nome=__ping__ responderá 200 (se existir) ou 500 (se não achar),
    // mas se o servidor estiver rodando, haverá resposta HTTP válida, confirmando conectividade.
    const response = await fetch(`${API_BASE_URL}?nome=__ping__`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Servidor online e respondendo
    elements.statusDot.className = 'status-indicator-dot online';
    elements.statusText.textContent = 'Conectado (8080)';
    elements.statusText.style.color = '#10b981';
  } catch (error) {
    // Falha de rede (servidor offline ou porta fechada)
    elements.statusDot.className = 'status-indicator-dot offline';
    elements.statusText.textContent = 'Desconectado';
    elements.statusText.style.color = '#ef4444';
    console.warn('[API Status] Backend Spring Boot offline ou inacessível em http://localhost:8080/marca:', error.message);
  }
}

// ------------------------------------------------------------------------------
// 5. INTEGRAÇÃO REST - OPERAÇÕES HTTP (FETCH API + ASYNC/AWAIT)
// ------------------------------------------------------------------------------

/**
 * -----------------------------------------------------------------------------
 * 1. CADASTRAR MARCA (POST)
 * -----------------------------------------------------------------------------
 * - Verbo HTTP: POST
 * - Endpoint: http://localhost:8080/marca
 * - Headers: Content-Type: application/json
 * - Body: JSON contendo { nome, ano, pais, crueltyFree }
 * - Resposta esperada: HTTP 200 OK com corpo vazio (ResponseEntity.ok().build())
 * -----------------------------------------------------------------------------
 * @param {Object} dadosMarca Objeto com dados da marca a cadastrar
 * @returns {Promise<boolean>} Retorna true em caso de sucesso
 */
async function cadastrarMarcaApi(dadosMarca) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosMarca)
    });

    // O backend responde 200 OK (com corpo vazio) ao persistir com sucesso
    if (!response.ok) {
      const errorMsg = await extrairMensagemErro(response);
      throw new Error(errorMsg || `Falha ao salvar marca (HTTP ${response.status})`);
    }

    return true;
  } catch (error) {
    console.error('[POST /marca] Erro na requisição:', error);
    throw error;
  }
}

/**
 * -----------------------------------------------------------------------------
 * 2. BUSCAR MARCA POR NOME (GET)
 * -----------------------------------------------------------------------------
 * - Verbo HTTP: GET
 * - Endpoint: http://localhost:8080/marca?nome={nomeDigitado}
 * - Parâmetro: Parâmetro de query 'nome' codificado com encodeURIComponent
 * - Resposta esperada: HTTP 200 OK com objeto JSON { id, nome, ano, pais, crueltyFree }
 *   ou HTTP 500/erro caso o registro não exista no banco.
 * -----------------------------------------------------------------------------
 * @param {string} nome Nome da marca para consulta
 * @returns {Promise<Object>} Objeto da marca encontrada
 */
async function buscarMarcaPorNomeApi(nome) {
  try {
    const url = `${API_BASE_URL}?nome=${encodeURIComponent(nome.trim())}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Se o backend responder com erro (ex: RuntimeException "Nome não encontrado")
    if (!response.ok) {
      if (response.status === 404 || response.status === 500) {
        throw new Error(`A marca "${nome}" não foi encontrada no catálogo.`);
      }
      const errorMsg = await extrairMensagemErro(response);
      throw new Error(errorMsg || `Erro na consulta (HTTP ${response.status})`);
    }

    // Processa o corpo da resposta em formato JSON
    const marca = await response.json();
    return marca;
  } catch (error) {
    console.error('[GET /marca?nome=...] Erro na requisição:', error);
    throw error;
  }
}

/**
 * -----------------------------------------------------------------------------
 * 3. ATUALIZAR MARCA POR ID (PUT)
 * -----------------------------------------------------------------------------
 * - Verbo HTTP: PUT
 * - Endpoint: http://localhost:8080/marca?id={idDaMarca}
 * - Parâmetro de query: id da marca a ser atualizada
 * - Headers: Content-Type: application/json
 * - Body: JSON com os campos atualizados { nome, ano, pais, crueltyFree }
 * - Resposta esperada: HTTP 200 OK com corpo vazio (ResponseEntity.ok().build())
 * -----------------------------------------------------------------------------
 * @param {number} id Identificador numérico da marca
 * @param {Object} dadosMarca Dados novos ou alterados da marca
 * @returns {Promise<boolean>} Retorna true em caso de sucesso
 */
async function atualizarMarcaPorIdApi(id, dadosMarca) {
  try {
    const url = `${API_BASE_URL}?id=${encodeURIComponent(id)}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosMarca)
    });

    // O backend responde 200 OK com corpo vazio
    if (!response.ok) {
      const errorMsg = await extrairMensagemErro(response);
      throw new Error(errorMsg || `Falha ao atualizar marca de ID #${id} (HTTP ${response.status})`);
    }

    return true;
  } catch (error) {
    console.error('[PUT /marca?id=...] Erro na requisição:', error);
    throw error;
  }
}

/**
 * -----------------------------------------------------------------------------
 * 4. EXCLUIR MARCA POR NOME (DELETE)
 * -----------------------------------------------------------------------------
 * - Verbo HTTP: DELETE
 * - Endpoint: http://localhost:8080/marca?nome={nomeDaMarca}
 * - Parâmetro de query: nome da marca codificado com encodeURIComponent
 * - Resposta esperada: HTTP 200 OK com corpo vazio (ResponseEntity.ok().build())
 * -----------------------------------------------------------------------------
 * @param {string} nome Nome da marca a ser excluída
 * @returns {Promise<boolean>} Retorna true em caso de sucesso
 */
async function deletarMarcaPorNomeApi(nome) {
  try {
    const url = `${API_BASE_URL}?nome=${encodeURIComponent(nome.trim())}`;

    const response = await fetch(url, {
      method: 'DELETE'
    });

    // O backend responde 200 OK com corpo vazio
    if (!response.ok) {
      const errorMsg = await extrairMensagemErro(response);
      throw new Error(errorMsg || `Falha ao excluir a marca "${nome}" (HTTP ${response.status})`);
    }

    return true;
  } catch (error) {
    console.error('[DELETE /marca?nome=...] Erro na requisição:', error);
    throw error;
  }
}

/**
 * Tenta extrair mensagens de erro em JSON ou texto retornadas pelo Spring Boot.
 */
async function extrairMensagemErro(response) {
  try {
    const data = await response.json();
    return data.message || data.error || null;
  } catch {
    try {
      const text = await response.text();
      return text || null;
    } catch {
      return null;
    }
  }
}

// ------------------------------------------------------------------------------
// 6. MANIPULAÇÃO DA INTERFACE DO USUÁRIO (UI/UX)
// ------------------------------------------------------------------------------

/**
 * Renderiza os dados da marca encontrada no card detalhado (Seções 2 e 3).
 * @param {Object} marca Objeto retornado pela API
 */
function renderizarCardMarca(marca) {
  marcaAtual = marca;

  // Atualiza campos do card
  elements.cardMarcaId.textContent = `ID #${marca.id}`;
  elements.cardMarcaNome.textContent = marca.nome || 'Sem nome';
  elements.cardMarcaAno.textContent = marca.ano ? marca.ano : 'Não informado';
  elements.cardMarcaPais.textContent = marca.pais ? marca.pais : 'Não informado';

  // Badge estilizado de Cruelty-Free
  if (marca.crueltyFree) {
    elements.cardMarcaBadgeCruelty.className = 'cruelty-badge is-cruelty-free';
    elements.cardMarcaBadgeCruelty.innerHTML = `
      <span aria-hidden="true">🐇</span>
      <span>Cruelty-Free (Livre de Crueldade)</span>
    `;
    elements.cardMarcaBadgeCruelty.title = 'Esta marca não realiza testes em animais.';
  } else {
    elements.cardMarcaBadgeCruelty.className = 'cruelty-badge not-cruelty-free';
    elements.cardMarcaBadgeCruelty.innerHTML = `
      <span aria-hidden="true">🧪</span>
      <span>Não Certificado Cruelty-Free</span>
    `;
    elements.cardMarcaBadgeCruelty.title = 'Sem certificação livre de crueldade animal informada.';
  }

  // Alterna visibilidade dos estados
  elements.estadoVazio.classList.add('hidden');
  elements.estadoCarregando.classList.add('hidden');
  elements.cardMarca.classList.remove('hidden');
}

/**
 * Reseta a visualização do card para o estado inicial vazio.
 */
function limparCardMarca() {
  marcaAtual = null;
  elements.cardMarca.classList.add('hidden');
  elements.estadoCarregando.classList.add('hidden');
  elements.estadoVazio.classList.remove('hidden');
}

/**
 * Exibe o estado de carregamento com animação de spinner.
 */
function mostrarCarregamentoCard() {
  elements.estadoVazio.classList.add('hidden');
  elements.cardMarca.classList.add('hidden');
  elements.estadoCarregando.classList.remove('hidden');
}

/**
 * Abre o modal de edição preenchido com as propriedades da marca atual.
 * @param {Object} marca Dados atuais da marca
 */
function abrirModalEdicao(marca) {
  if (!marca) return;

  elements.editMarcaId.value = marca.id;
  elements.editMarcaIdDisplay.textContent = `#${marca.id}`;
  elements.editNome.value = marca.nome || '';
  elements.editAno.value = marca.ano || '';
  elements.editPais.value = marca.pais || '';
  elements.editCrueltyFree.checked = Boolean(marca.crueltyFree);

  elements.modalEdicao.classList.remove('hidden');
  elements.editNome.focus();
}

/**
 * Fecha o modal de edição e limpa os campos.
 */
function fecharModalEdicao() {
  elements.modalEdicao.classList.add('hidden');
  elements.formEdicao.reset();
}

/**
 * Abre o modal de confirmação para exclusão segura.
 * @param {string} nomeMarca Nome da marca a ser excluída
 */
function abrirModalExclusao(nomeMarca) {
  marcaParaExcluir = nomeMarca;
  elements.exclusaoNomeMarca.textContent = `"${nomeMarca}"`;
  elements.modalExclusao.classList.remove('hidden');
  elements.btnConfirmarExclusao.focus();
}

/**
 * Fecha o modal de confirmação de exclusão.
 */
function fecharModalExclusao() {
  marcaParaExcluir = null;
  elements.modalExclusao.classList.add('hidden');
}

/**
 * Alterna estado de carregamento em um botão (desabilita e exibe feedback).
 */
function setButtonLoading(button, isLoading, loadingText = 'Aguarde...') {
  const textSpan = button.querySelector('.btn-text');
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalHtml = button.innerHTML;
    button.innerHTML = `
      <div class="spinner" style="width:16px;height:16px;border-width:2px;margin:0;"></div>
      <span>${loadingText}</span>
    `;
  } else {
    button.disabled = false;
    if (button.dataset.originalHtml) {
      button.innerHTML = button.dataset.originalHtml;
    }
  }
}

// ------------------------------------------------------------------------------
// 7. CONTROLE DE EVENTOS (EVENT LISTENERS)
// ------------------------------------------------------------------------------

/**
 * EVENTO: Submissão do Formulário de Cadastro (POST /marca)
 */
elements.formCadastro.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = elements.cadNome.value.trim();
  const anoRaw = elements.cadAno.value.trim();
  const pais = elements.cadPais.value.trim();
  const crueltyFree = elements.cadCrueltyFree.checked;

  // Validação básica do campo obrigatório Nome
  if (!nome) {
    showToast('Atenção', 'O campo "Nome da Marca" é obrigatório.', 'warning');
    elements.cadNome.focus();
    return;
  }

  // Montagem do payload de acordo com a entidade Java MarcasMaquiagem
  const payload = {
    nome: nome,
    ano: anoRaw ? parseInt(anoRaw, 10) : null,
    pais: pais || null,
    crueltyFree: crueltyFree
  };

  setButtonLoading(elements.btnSubmitCadastro, true, 'Cadastrando...');

  try {
    await cadastrarMarcaApi(payload);

    showToast('Sucesso!', `A marca "${nome}" foi cadastrada com sucesso!`, 'success');

    // Limpa o formulário após cadastro bem-sucedido
    elements.formCadastro.reset();
    elements.cadNome.focus();

    // Atualiza status da API
    verificarStatusApi();
  } catch (error) {
    showToast('Erro ao Cadastrar', error.message || 'Verifique se o backend Spring Boot está em execução.', 'error');
  } finally {
    setButtonLoading(elements.btnSubmitCadastro, false);
  }
});

/**
 * EVENTO: Botão Limpar Campos do Cadastro
 */
elements.btnLimparCadastro.addEventListener('click', () => {
  elements.formCadastro.reset();
  elements.cadNome.focus();
});

/**
 * EVENTO: Submissão da Busca por Nome (GET /marca?nome=...)
 */
elements.formBusca.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = elements.inputBuscaNome.value.trim();
  if (!nome) {
    showToast('Campo Vazio', 'Informe o nome da marca para consultar.', 'warning');
    elements.inputBuscaNome.focus();
    return;
  }

  setButtonLoading(elements.btnBuscar, true, 'Buscando...');
  mostrarCarregamentoCard();

  try {
    const marca = await buscarMarcaPorNomeApi(nome);
    renderizarCardMarca(marca);
    showToast('Marca Localizada', `Dados de "${marca.nome}" carregados com sucesso.`, 'info');
  } catch (error) {
    limparCardMarca();
    showToast('Não Encontrada', error.message || 'Marca não encontrada.', 'error');
  } finally {
    setButtonLoading(elements.btnBuscar, false);
  }
});

/**
 * EVENTO: Botão "Editar" no Card da Marca Encontrada
 */
elements.btnCardEditar.addEventListener('click', () => {
  if (marcaAtual) {
    abrirModalEdicao(marcaAtual);
  }
});

/**
 * EVENTO: Submissão do Formulário de Edição (PUT /marca?id={id})
 */
elements.formEdicao.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = parseInt(elements.editMarcaId.value, 10);
  const nome = elements.editNome.value.trim();
  const anoRaw = elements.editAno.value.trim();
  const pais = elements.editPais.value.trim();
  const crueltyFree = elements.editCrueltyFree.checked;

  if (!id) {
    showToast('Erro', 'Identificador da marca inválido.', 'error');
    return;
  }

  if (!nome) {
    showToast('Atenção', 'O nome da marca não pode ficar vazio.', 'warning');
    elements.editNome.focus();
    return;
  }

  const payload = {
    nome: nome,
    ano: anoRaw ? parseInt(anoRaw, 10) : null,
    pais: pais || null,
    crueltyFree: crueltyFree
  };

  setButtonLoading(elements.btnSalvarEdicao, true, 'Salvando...');

  try {
    await atualizarMarcaPorIdApi(id, payload);

    showToast('Atualizado!', `A marca "${nome}" foi atualizada com sucesso.`, 'success');

    // Atualiza o card exibido na tela com os novos valores
    renderizarCardMarca({
      id: id,
      nome: payload.nome,
      ano: payload.ano,
      pais: payload.pais,
      crueltyFree: payload.crueltyFree
    });

    fecharModalEdicao();
  } catch (error) {
    showToast('Erro ao Atualizar', error.message || 'Falha ao salvar alterações.', 'error');
  } finally {
    setButtonLoading(elements.btnSalvarEdicao, false);
  }
});

/**
 * EVENTO: Botão "Excluir" no Card da Marca Encontrada
 */
elements.btnCardExcluir.addEventListener('click', () => {
  if (marcaAtual && marcaAtual.nome) {
    abrirModalExclusao(marcaAtual.nome);
  }
});

/**
 * EVENTO: Confirmação da Exclusão no Modal (DELETE /marca?nome=...)
 */
elements.btnConfirmarExclusao.addEventListener('click', async () => {
  if (!marcaParaExcluir) return;

  const nome = marcaParaExcluir;
  setButtonLoading(elements.btnConfirmarExclusao, true, 'Excluindo...');

  try {
    await deletarMarcaPorNomeApi(nome);

    showToast('Excluído!', `A marca "${nome}" foi excluída do catálogo.`, 'success');

    // Limpa o card da tela após exclusão bem-sucedida
    limparCardMarca();
    elements.inputBuscaNome.value = '';

    fecharModalExclusao();
  } catch (error) {
    showToast('Erro ao Excluir', error.message || 'Falha ao excluir marca.', 'error');
  } finally {
    setButtonLoading(elements.btnConfirmarExclusao, false);
  }
});

/**
 * EVENTO: Fechamento dos Modais
 */
elements.btnFecharModalEdicao.addEventListener('click', fecharModalEdicao);
elements.btnCancelarEdicao.addEventListener('click', fecharModalEdicao);
elements.btnCancelarExclusao.addEventListener('click', fecharModalExclusao);

// Fechar modais ao clicar no fundo escuro
window.addEventListener('click', (event) => {
  if (event.target === elements.modalEdicao) {
    fecharModalEdicao();
  }
  if (event.target === elements.modalExclusao) {
    fecharModalExclusao();
  }
});

// Fechar modais com tecla ESC
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!elements.modalEdicao.classList.contains('hidden')) {
      fecharModalEdicao();
    }
    if (!elements.modalExclusao.classList.contains('hidden')) {
      fecharModalExclusao();
    }
  }
});

/**
 * EVENTO: Limpar Card Manualmente
 */
elements.btnCardLimpar.addEventListener('click', () => {
  limparCardMarca();
  elements.inputBuscaNome.value = '';
});

/**
 * EVENTO: Botão de Reverificar Conexão com a API
 */
elements.btnCheckApi.addEventListener('click', () => {
  verificarStatusApi();
  showToast('Conexão', 'Verificando conectividade com o backend Spring Boot...', 'info');
});

// ------------------------------------------------------------------------------
// 8. INICIALIZAÇÃO DA APLICAÇÃO
// ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Faz o health check inicial
  verificarStatusApi();

  // Foco inicial no campo de nome para melhor usabilidade
  if (elements.cadNome) {
    elements.cadNome.focus();
  }
});

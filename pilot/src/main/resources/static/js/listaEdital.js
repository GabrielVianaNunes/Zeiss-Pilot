document.addEventListener('DOMContentLoaded', function() {
    // Configurações
    const API_BASE_URL = '/editais/api';
    const modal = document.getElementById('modalEdital');
    const formEdital = document.getElementById('formEdital');
    const itensPorPagina = 10;
    let paginaAtual = 0;
    let todosEditais = [];
    let totalPaginas = 0;
    let csrfToken = document.querySelector('meta[name="_csrf"]')?.content || '';
    let csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content || 'X-CSRF-TOKEN';

    // Elementos da paginação
    const btnAnterior = document.getElementById('btnAnterior');
    const btnProxima = document.getElementById('btnProxima');
    const paginacaoNumeros = document.getElementById('paginacaoNumeros');

    // Carregar editais ao iniciar
    carregarTodosEditais();

    // Event Listeners
    document.getElementById('btnCriarEdital').addEventListener('click', () => {
        resetForm();
        document.getElementById('modalTitulo').textContent = 'Criar Edital';
        document.getElementById('btnRemover').style.display = 'none';
        abrirModal();
    });

    document.querySelector('.close').addEventListener('click', fecharModal);
    window.addEventListener('click', (e) => e.target === modal && fecharModal());

    document.getElementById('btnRemover').addEventListener('click', removerEdital);
    formEdital.addEventListener('submit', (e) => {
        e.preventDefault();
        salvarEdital();
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-editar')) {
            carregarEditalParaEdicao(e.target.dataset.id);
        }
    });

    // Event listeners da paginação
    btnAnterior.addEventListener('click', () => {
        if (paginaAtual > 0) {
            paginaAtual--;
            renderizarPaginaAtual();
            atualizarPaginacao();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    btnProxima.addEventListener('click', () => {
        if (paginaAtual < totalPaginas - 1) {
            paginaAtual++;
            renderizarPaginaAtual();
            atualizarPaginacao();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Funções principais
    async function carregarTodosEditais() {
        try {
            const response = await fetch(API_BASE_URL, {
                headers: {
                    'Accept': 'application/json',
                    [csrfHeader]: csrfToken
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao carregar editais');
            }
            
            todosEditais = await response.json();
            totalPaginas = Math.ceil(todosEditais.length / itensPorPagina);
            atualizarPaginacao();
            renderizarPaginaAtual();
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    function renderizarPaginaAtual() {
        const inicio = paginaAtual * itensPorPagina;
        const fim = Math.min(inicio + itensPorPagina, todosEditais.length);
        const editaisPagina = todosEditais.slice(inicio, fim);
        
        renderizarEditais(editaisPagina);
    }

    function atualizarPaginacao() {
        totalPaginas = Math.ceil(todosEditais.length / itensPorPagina);
        btnAnterior.disabled = paginaAtual === 0;
        btnProxima.disabled = paginaAtual >= totalPaginas - 1;
        paginacaoNumeros.textContent = `Página ${paginaAtual + 1}`;
    }

    async function carregarEditalParaEdicao(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    [csrfHeader]: csrfToken
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Edital não encontrado');
            }
            
            const edital = await response.json();
            preencherFormulario(edital);
            document.getElementById('modalTitulo').textContent = 'Editar Edital';
            document.getElementById('btnRemover').style.display = 'inline-block';
            abrirModal();
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    async function salvarEdital() {
        // Valida o formulário antes de enviar
        if (!validarFormulario()) {
            return;
        }

        const formData = getFormData();
        const btnSalvar = document.getElementById('btnSalvar');
        const btnTextoOriginal = btnSalvar.textContent;
        
        try {
            btnSalvar.disabled = true;
            btnSalvar.textContent = 'Salvando...';
            
            const url = formData.id ? `${API_BASE_URL}/${formData.id}` : API_BASE_URL;
            const method = formData.id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    [csrfHeader]: csrfToken
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao salvar edital');
            }
            
            await response.json();
            fecharModal();
            carregarTodosEditais();
        } catch (error) {
            console.error('Erro:', error);
        } finally {
            btnSalvar.disabled = false;
            btnSalvar.textContent = btnTextoOriginal;
        }
    }

    async function removerEdital() {
        const id = document.getElementById('editalId').value;
        if (!id) return;
        
        if (!confirm('Tem certeza que deseja remover este edital permanentemente?')) {
            return;
        }
        
        const btnRemover = document.getElementById('btnRemover');
        const btnTextoOriginal = btnRemover.textContent;
        
        try {
            btnRemover.disabled = true;
            btnRemover.textContent = 'Removendo...';
            
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    [csrfHeader]: csrfToken
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao remover edital');
            }
            
            fecharModal();
            carregarTodosEditais();
        } catch (error) {
            console.error('Erro ao remover edital:', error);
        } finally {
            btnRemover.disabled = false;
            btnRemover.textContent = btnTextoOriginal;
        }
    }

    // Funções auxiliares
    function renderizarEditais(editais) {
        const tabela = document.getElementById('tabelaEditais');
        tabela.innerHTML = editais.map(edital => `
            <tr data-id="${edital.id}">
                <td>${edital.nomeEdital}</td>
                <td>${edital.instituicaoFornecedora}</td>
                <td>${edital.instituicaoParceira || '-'}</td>
                <td>${formatarMoeda(edital.valor)}</td>
                <td><div class="status-display">${edital.status}</div></td>
                <td>${edital.observacao || '-'}</td>
                <td><button class="btn-editar" data-id="${edital.id}">Editar</button></td>
            </tr>
        `).join('');
    }

    function preencherFormulario(edital) {
        document.getElementById('editalId').value = edital.id;
        document.getElementById('nomeEdital').value = edital.nomeEdital;
        document.getElementById('instituicaoFornecedora').value = edital.instituicaoFornecedora;
        document.getElementById('instituicaoParceira').value = edital.instituicaoParceira || '';
        document.getElementById('valor').value = edital.valor;
        document.getElementById('status').value = edital.status;
        document.getElementById('observacao').value = edital.observacao || '';
    }

    // Função para sanitizar strings (remover caracteres inválidos)
    function sanitizarTexto(texto) {
        if (!texto) return texto;
        
        // Permite: letras (incluindo acentuadas), números, espaços, hífens, vírgulas, pontos
        // e alguns símbolos básicos como @, #, $, etc.
        return texto.toString()
                   .replace(/[^a-zA-ZÀ-ÿ0-9\s@#$%&*()_+=\-[\]{};':"\\|,.<>\/?]/g, '')
                   .replace(/\s+/g, ' ') // Remove múltiplos espaços
                   .trim(); // Remove espaços no início e fim
    }

    // Função para validar um campo de texto
    function validarCampoTexto(campo, nomeCampo) {
        const valor = campo.value;
        const sanitizado = sanitizarTexto(valor);
        
        if (valor !== sanitizado) {
            alert(`O campo "${nomeCampo}" contém caracteres inválidos. Serão removidos automaticamente.`);
            campo.value = sanitizado;
            return false;
        }
        return true;
    }

    // Função para validar todos os campos antes do envio
    function validarFormulario() {
        let valido = true;
        
        // Validação para Nome do Edital
        const nomeEdital = document.getElementById('nomeEdital');
        valido = validarCampoTexto(nomeEdital, 'Nome do Edital') && valido;
        
        // Validação para Instituição Fornecedora
        const instituicaoFornecedora = document.getElementById('instituicaoFornecedora');
        valido = validarCampoTexto(instituicaoFornecedora, 'Instituição Fornecedora') && valido;
        
        // Validação para Instituição Parceira
        const instituicaoParceira = document.getElementById('instituicaoParceira');
        valido = validarCampoTexto(instituicaoParceira, 'Instituição Parceira') && valido;
        
        // Validação para Observação
        const observacao = document.getElementById('observacao');
        valido = validarCampoTexto(observacao, 'Observação') && valido;
        
        return valido;
    }

    function getFormData() {
        return {
            id: document.getElementById('editalId').value ? parseInt(document.getElementById('editalId').value) : null,
            nomeEdital: sanitizarTexto(document.getElementById('nomeEdital').value),
            instituicaoFornecedora: sanitizarTexto(document.getElementById('instituicaoFornecedora').value),
            instituicaoParceira: sanitizarTexto(document.getElementById('instituicaoParceira').value),
            valor: parseFloat(document.getElementById('valor').value.replace(',', '.')),
            status: document.getElementById('status').value,
            observacao: sanitizarTexto(document.getElementById('observacao').value)
        };
    }

    function formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    function abrirModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function fecharModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
    }

    function resetForm() {
        formEdital.reset();
        document.getElementById('editalId').value = '';
        document.getElementById('status').value = 'Aguardando aprovação';
    }

    // Validação do campo valor
    document.getElementById('valor').addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^\d,]/g, '');
        let parts = value.split(',');
        if (parts.length > 2) value = parts[0] + ',' + parts.slice(1).join('');
        if (parts[1] && parts[1].length > 2) value = parts[0] + ',' + parts[1].substring(0, 2);
        e.target.value = value;
    });

    // Validação em tempo real para campos de texto
    document.getElementById('nomeEdital').addEventListener('input', function(e) {
        this.value = sanitizarTexto(this.value);
    });

    document.getElementById('instituicaoFornecedora').addEventListener('input', function(e) {
        this.value = sanitizarTexto(this.value);
    });

    document.getElementById('instituicaoParceira').addEventListener('input', function(e) {
        this.value = sanitizarTexto(this.value);
    });

    document.getElementById('observacao').addEventListener('input', function(e) {
        this.value = sanitizarTexto(this.value);
    });
});
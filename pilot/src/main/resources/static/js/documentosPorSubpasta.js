// /js/documentosPorSubpasta.js
document.addEventListener("DOMContentLoaded", () => {
  const tabela           = document.getElementById("tabelaDocumentos");
  const filtroNome       = document.getElementById("filtroNome");
  const filtroStatus     = document.getElementById("filtroStatus");
  const spanPaginaAtual  = document.getElementById("paginaAtual");
  const btnAnterior      = document.getElementById("btnAnterior");
  const btnProximo       = document.getElementById("btnProximo");

  // CSRF (se estiver disponível via Thymeleaf)
  const csrfToken  = window.csrfToken  || "";
  const csrfHeader = window.csrfHeader || "";

  // subpastaId da URL
  const urlParams  = new URLSearchParams(window.location.search);
  const subpastaId = urlParams.get("id");

  let paginaAtual   = 0;
  const tamanhoPag  = 8;
  let totalPaginas  = 1;

  function carregarDocumentos() {
    if (!subpastaId) {
      console.error("ID da subpasta não encontrado na URL.");
      renderizarTabela([]);
      atualizarPaginacao(1);
      return;
    }

    const nome   = (filtroNome?.value || "").trim();
    const status = (filtroStatus?.value || "").trim();

    const params = new URLSearchParams();
    if (nome)   params.append("nome", nome);
    if (status) params.append("status", status);
    params.append("page", paginaAtual);
    params.append("size", tamanhoPag);

    fetch(`/api/documentos/subpasta/${encodeURIComponent(subpastaId)}?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error(`Erro ${res.status} ao buscar documentos.`);
        return res.json();
      })
      .then(data => {
        const documentos = Array.isArray(data?.content) ? data.content : [];
        totalPaginas = Number.isFinite(data?.totalPages) ? data.totalPages : 1;
        renderizarTabela(documentos);
        atualizarPaginacao(totalPaginas);
      })
      .catch(err => {
        console.error("Erro ao carregar documentos:", err);
        renderizarTabela([]);
        atualizarPaginacao(1);
      });
  }

  function renderizarTabela(documentos) {
    tabela.innerHTML = "";

    if (!documentos.length) {
      tabela.innerHTML = `<tr><td colspan="4">Nenhum documento encontrado.</td></tr>`;
      return;
    }

    documentos.forEach(doc => {
      // papel do usuário vindo do DTO (preferencial) ou global
      const papel = doc.usuarioRole || window.usuarioRole || "";
      const isAdmin = String(papel).toUpperCase() === "ROLE_ADMIN" || String(papel).toUpperCase() === "ADMIN";

      // datas e status
      const dataExp = doc.dataExpiracao
        ? new Date(doc.dataExpiracao).toLocaleDateString("pt-BR")
        : "-";

      const statusRaw = (doc.status || "").toString();
      const statusFmt = statusRaw
        ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1).toLowerCase()
        : "-";
      const classeStatus = statusRaw.toLowerCase().replace(/\s+/g, "-");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(doc.nomeArquivo || doc.nome || "—")}</td>
        <td>${dataExp}</td>
        <td><span class="status ${classeStatus}">${escapeHtml(statusFmt)}</span></td>
        <td>
          <button class="acao abrir" onclick="abrirPDF(${Number(doc.id)})">Abrir</button>
          ${
            isAdmin
              ? `<button class="acao editar"  onclick="editarPDF(${Number(doc.id)})">Editar</button>
                 <button class="acao excluir" onclick="excluirPDF(${Number(doc.id)})">Excluir</button>`
              : ""
          }
        </td>
      `;
      tabela.appendChild(tr);
    });
  }

  function atualizarPaginacao(totalPages) {
    btnAnterior.disabled = paginaAtual <= 0;
    btnProximo.disabled  = paginaAtual >= (totalPages - 1);
    spanPaginaAtual.textContent = (paginaAtual + 1);
  }

  // Navegação
  window.paginaAnterior = () => {
    if (paginaAtual > 0) {
      paginaAtual--;
      carregarDocumentos();
    }
  };

  window.proximaPagina = () => {
    if (paginaAtual < totalPaginas - 1) {
      paginaAtual++;
      carregarDocumentos();
    }
  };

  window.mudarPagina = (pagina) => {
    const alvo = Number(pagina);
    if (Number.isFinite(alvo) && alvo >= 0 && alvo < totalPaginas) {
      paginaAtual = alvo;
      carregarDocumentos();
    }
  };

  // Ações
  window.abrirPDF = (id) => {
    // Mantendo a rota usada no restante do projeto
    window.open(`/api/documentos/abrir/${encodeURIComponent(id)}`, "_blank");
  };

  window.editarPDF = (id) => {
    alert("Funcionalidade de edição será implementada aqui.");
    // Ex.: abrir modal, PUT em /api/documentos/{id} com CSRF, etc.
  };

  window.excluirPDF = (id) => {
    if (!confirm("Tem certeza que deseja excluir este documento?")) return;

    const headers = new Headers();
    if (csrfHeader && csrfToken) headers.append(csrfHeader, csrfToken);

    fetch(`/api/documentos/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers
    })
      .then(res => {
        if (res.ok) {
          alert("Documento excluído com sucesso.");
          carregarDocumentos();
        } else {
          alert("Erro ao excluir documento.");
        }
      })
      .catch(err => console.error("Erro na exclusão:", err));
  };

  // Filtros
  window.limparFiltros = () => {
    if (filtroNome)   filtroNome.value = "";
    if (filtroStatus) filtroStatus.value = "";
    paginaAtual = 0;
    carregarDocumentos();
  };

  filtroNome?.addEventListener("input", () => {
    paginaAtual = 0;
    carregarDocumentos();
  });

  filtroStatus?.addEventListener("change", () => {
    paginaAtual = 0;
    carregarDocumentos();
  });

  // Utilitário simples para evitar XSS em campos de texto
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Bootstrap
  carregarDocumentos();
});

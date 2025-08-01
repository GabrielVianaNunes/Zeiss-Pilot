document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formDocumento");
  const tabelaCorpo = document.getElementById("tabelaCorpo");
  const botaoToggle = document.getElementById("btnMostrarUpload");
  const csrfToken = window.csrfToken || '';
  const csrfHeader = window.csrfHeader || '';
  const barraPesquisa = document.getElementById("barraPesquisa");
  const filtroStatus = document.getElementById("filtroStatus");
  const btnLimparFiltros = document.getElementById("btnLimparFiltros");
  const btnAnterior = document.getElementById("btnAnterior");
  const btnProximo = document.getElementById("btnProximo");
  const spanPaginaAtual = document.getElementById("paginaAtual");

  let paginaAtual = 0;
  const tamanhoPagina = 10;
  let totalPaginas = 1;

  botaoToggle.addEventListener("click", () => {
    const aberto = form.classList.contains("ativo");
    form.classList.toggle("ativo");
    botaoToggle.textContent = aberto ? "Adicionar Arquivo" : "Fechar Formulário";
    if (!aberto) {
      const offsetTop = form.getBoundingClientRect().top + window.scrollY - 280;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const arquivo = document.getElementById("arquivo").files[0];
    const dataExpiracao = document.getElementById("dataExpiracao").value;

    if (!arquivo || !dataExpiracao) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const formData = new FormData();
    formData.append("arquivo", arquivo);
    formData.append("dataExpiracao", dataExpiracao);

    const headers = new Headers();
    if (csrfHeader && csrfToken) headers.append(csrfHeader, csrfToken);

    try {
      const response = await fetch("/api/documentos", {
        method: "POST",
        body: formData,
        headers: headers
      });

      if (response.ok) {
        alert("Documento enviado com sucesso!");
        form.reset();
        document.getElementById("arquivoSelecionado").textContent = "Nenhum arquivo selecionado";
        await aplicarFiltros(); // recarrega
      } else {
        alert("Erro ao enviar documento.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro na requisição.");
    }
  });

  async function aplicarFiltros() {
    const termo = barraPesquisa.value.trim();
    const status = filtroStatus.value;

    const params = new URLSearchParams();
    if (termo) params.append("nome", termo);
    if (status) params.append("status", status);
    params.append("page", paginaAtual);
    params.append("size", tamanhoPagina);

    try {
      const response = await fetch(`/api/documentos/usuario/meus?${params.toString()}`);
      const page = await response.json();

      if (!page || !Array.isArray(page.content)) throw new Error("Resposta inválida");

      renderizarTabela(page.content);
      totalPaginas = page.totalPages;
      atualizarControlesPaginacao();
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    }
  }

  function renderizarTabela(lista) {
    tabelaCorpo.innerHTML = "";
    lista.forEach(doc => {
      const statusFormatado = doc.status.charAt(0).toUpperCase() + doc.status.slice(1).toLowerCase();
      const classeStatus = doc.status.toLowerCase().replace(/\s/g, '-');

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${doc.nomeArquivo}</td>
        <td>${formatarData(doc.dataExpiracao)}</td>
        <td><span class="status ${classeStatus}">${statusFormatado}</span></td>
        <td><button class="acao abrir" onclick="abrirPDF(${doc.id})">Abrir</button></td>
        <td><button class="acao editar" onclick='abrirModalEdicao(${JSON.stringify(doc)})'>Editar</button></td>
      `;
      tabelaCorpo.appendChild(tr);
    });
  }

  function atualizarControlesPaginacao() {
    spanPaginaAtual.textContent = (paginaAtual + 1);
    btnAnterior.disabled = paginaAtual === 0;
    btnProximo.disabled = paginaAtual >= totalPaginas - 1;
  }

  btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 0) {
      paginaAtual--;
      aplicarFiltros();
    }
  });

  btnProximo.addEventListener("click", () => {
    if (paginaAtual < totalPaginas - 1) {
      paginaAtual++;
      aplicarFiltros();
    }
  });

  window.abrirPDF = function(id) {
    window.open(`/api/documentos/abrir/${id}`, '_blank');
  };

  function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  window.abrirModalEdicao = function (doc) {
    let modal = document.getElementById("modalEdicao");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modalEdicao";
      modal.classList.add("modal-overlay");
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content">
        <h3>Editar Documento</h3>
        <label for="novaDataExpiracao">Nova data de expiração:</label><br>
        <input type="date" id="novaDataExpiracao"><br>
        <button id="btnSalvarEdicao" class="editar">Salvar</button>
        <button id="btnExcluirEdicao" class="excluir">Excluir</button><br><br>
        <button class="fechar">Fechar</button>
      </div>
    `;

    document.getElementById("novaDataExpiracao").value = doc.dataExpiracao;
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("mostrar"), 10);

    modal.querySelector(".fechar").onclick = () => {
      modal.classList.remove("mostrar");
      setTimeout(() => modal.style.display = "none", 300);
    };

    document.getElementById("btnSalvarEdicao").onclick = async () => {
      const novaData = document.getElementById("novaDataExpiracao").value;
      if (!novaData) {
        alert("Informe a nova data!");
        return;
      }

      const headers = new Headers();
      if (csrfHeader && csrfToken) headers.append(csrfHeader, csrfToken);

      try {
        const response = await fetch(`/api/documentos/${doc.id}/expiracao?data=${novaData}`, {
          method: "PUT",
          headers: headers
        });

        if (response.ok) {
          modal.classList.remove("mostrar");
          setTimeout(() => modal.style.display = "none", 300);
          aplicarFiltros();
        } else {
          alert("Erro ao atualizar a data.");
        }
      } catch (err) {
        alert("Erro ao atualizar a data.");
      }
    };

    document.getElementById("btnExcluirEdicao").onclick = async () => {
      if (!confirm("Deseja realmente excluir o documento?")) return;

      const headers = new Headers();
      if (csrfHeader && csrfToken) headers.append(csrfHeader, csrfToken);

      try {
        const response = await fetch(`/api/documentos/${doc.id}`, {
          method: "DELETE",
          headers: headers
        });

        if (response.ok) {
          modal.classList.remove("mostrar");
          setTimeout(() => modal.style.display = "none", 300);
          aplicarFiltros();
        } else {
          alert("Erro ao excluir documento.");
        }
      } catch (err) {
        alert("Erro ao excluir o documento.");
      }
    };
  };

  document.getElementById("arquivo").addEventListener("change", function () {
    const nome = this.files.length > 0 ? this.files[0].name : "Nenhum arquivo selecionado";
    document.getElementById("arquivoSelecionado").textContent = nome;
  });

  barraPesquisa.addEventListener("input", () => {
    paginaAtual = 0;
    aplicarFiltros();
  });

  filtroStatus.addEventListener("change", () => {
    paginaAtual = 0;
    aplicarFiltros();
  });

  btnLimparFiltros.addEventListener("click", () => {
    barraPesquisa.value = "";
    filtroStatus.value = "";
    paginaAtual = 0;
    aplicarFiltros();
  });

  aplicarFiltros();
});

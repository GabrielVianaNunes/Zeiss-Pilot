document.addEventListener("DOMContentLoaded", () => {
    const btnNovaVisita = document.getElementById("btnNovaVisita");
    const modal = document.getElementById("modalVisita");
    const closeModal = document.querySelector(".close");
    const visitasContainer = document.getElementById("visitasContainer");
    const visitaForm = document.getElementById("visitaForm");
    const campoPesquisa = document.getElementById("campoPesquisa");

    // Paginação
    const visitasPorPagina = 6;
    let paginaAtual = 1;
    let visitas = [];

    // 🔹 Define a data mínima como hoje nos campos de data
    function configurarMinimaDataHoje() {
        const hoje = new Date().toISOString().split("T")[0];
        document.getElementById("dataSolicitada").setAttribute("min", hoje);
        document.getElementById("dataAgendada").setAttribute("min", hoje);
    }

    // 🔹 Validações de campos de entrada
    function configurarValidacoesCampos() {
        const campoResponsavel = document.getElementById("responsavel");
        const campoQuantidade = document.getElementById("quantidade");
        const campoTelefones = document.getElementById("telefones");

        // 🔸 Somente letras com acento e espaços no campo "Responsável"
        campoResponsavel.addEventListener("input", () => {
            campoResponsavel.value = campoResponsavel.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
        });

        // 🔸 Somente números inteiros no campo "Quantidade de Visitantes"
        campoQuantidade.addEventListener("input", () => {
            campoQuantidade.value = campoQuantidade.value.replace(/[^\d]/g, "");
        });

        // 🔸 Corrige problema de backspace no campo de telefone
        let ultimaTeclaTelefone = "";

        campoTelefones.addEventListener("keydown", (e) => {
            ultimaTeclaTelefone = e.key;
        });

        campoTelefones.addEventListener("input", () => {
            if (ultimaTeclaTelefone === "Backspace") return;

            let valor = campoTelefones.value.replace(/\D/g, "").slice(0, 11);
            if (valor.length <= 10) {
                valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
            } else {
                valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
            }
            campoTelefones.value = valor.trim();
        });
    }

    // Abrir modal
    btnNovaVisita.onclick = () => {
        modal.style.display = "flex";
        visitaForm.reset();
        configurarMinimaDataHoje();
        configurarValidacoesCampos(); // ✅ Aplica validações sempre que abrir
    };

    // Fechar modal
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Carregar visitas do banco de dados
    function carregarVisitas() {
        fetch("/visitas-tecnicas/api")
            .then(response => response.json())
            .then(data => {
                visitas = data;
                paginaAtual = 1;
                renderizarVisitas();
                renderizarPaginacao();
            })
            .catch(error => console.error("Erro ao carregar visitas:", error));
    }

    function renderizarVisitas() {
        visitasContainer.innerHTML = "";
        const inicio = (paginaAtual - 1) * visitasPorPagina;
        const fim = inicio + visitasPorPagina;
        const visitasPagina = visitas.slice(inicio, fim);

        visitasPagina.forEach(visita => {
            const card = document.createElement("div");
            card.classList.add("visita-card");

            card.innerHTML = `
                <h3>${visita.responsavel}</h3>
                <p><strong>Empresa:</strong> ${visita.empresaInstituicao}</p>
                <p><strong>Data:</strong> ${visita.dataSolicitada}</p>
                <p><strong>Local:</strong> ${visita.localVisita}</p>
                <button class="btn-edit" onclick="editarVisita(${visita.id})">Editar</button>
                <button class="btn-delete" onclick="deletarVisita(${visita.id})">Excluir</button>
            `;
            visitasContainer.appendChild(card);
        });
    }

    function renderizarPaginacao() {
        let paginacao = document.querySelector(".paginacao");
        if (!paginacao) {
            paginacao = document.createElement("div");
            paginacao.className = "paginacao";
            visitasContainer.after(paginacao);
        }

        paginacao.innerHTML = "";

        const totalPaginas = Math.ceil(visitas.length / visitasPorPagina);

        const btnAnterior = document.createElement("button");
        btnAnterior.textContent = "Anterior";
        btnAnterior.disabled = paginaAtual === 1;
        btnAnterior.onclick = () => {
            if (paginaAtual > 1) {
                paginaAtual--;
                renderizarVisitas();
                renderizarPaginacao();
            }
        };

        const btnProximo = document.createElement("button");
        btnProximo.textContent = "Próximo";
        btnProximo.disabled = paginaAtual === totalPaginas;
        btnProximo.onclick = () => {
            if (paginaAtual < totalPaginas) {
                paginaAtual++;
                renderizarVisitas();
                renderizarPaginacao();
            }
        };

        const paginaAtualSpan = document.createElement("span");
        paginaAtualSpan.textContent = `Página ${paginaAtual} de ${totalPaginas}`;

        paginacao.appendChild(btnAnterior);
        paginacao.appendChild(paginaAtualSpan);
        paginacao.appendChild(btnProximo);
    }

    campoPesquisa.addEventListener("input", () => {
        const termo = campoPesquisa.value.toLowerCase();
        const visitasFiltradas = visitas.filter(visita =>
            visita.responsavel.toLowerCase().includes(termo) ||
            visita.empresaInstituicao.toLowerCase().includes(termo) ||
            visita.localVisita.toLowerCase().includes(termo)
        );
        paginaAtual = 1;
        visitas = visitasFiltradas;
        renderizarVisitas();
        renderizarPaginacao();
    });

    window.editarVisita = function(id) {
        const visita = visitas.find(v => v.id === id);
        document.getElementById("responsavel").value = visita.responsavel;
        modal.style.display = "flex";
        configurarMinimaDataHoje();
        configurarValidacoesCampos(); // ✅ Aplica também ao editar
    };

    window.deletarVisita = function(id) {
        if (confirm("Tem certeza que deseja excluir esta visita?")) {
            fetch(`/visitas-tecnicas/api/${id}`, { method: "DELETE" })
                .then(() => carregarVisitas())
                .catch(error => console.error("Erro ao excluir:", error));
        }
    };

    carregarVisitas();
});

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

    // Abrir modal
    btnNovaVisita.onclick = () => {
        modal.style.display = "flex";
        visitaForm.reset();
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
                paginaAtual = 1; // sempre começa da página 1
                renderizarVisitas();
                renderizarPaginacao();
            })
            .catch(error => console.error("Erro ao carregar visitas:", error));
    }

    // Exibir visitas por página
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

    // Criar botões de paginação
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

    // Filtrar visitas
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

    // Função para editar visita
    window.editarVisita = function(id) {
        const visita = visitas.find(v => v.id === id);
        document.getElementById("responsavel").value = visita.responsavel;
        // Adicione mais campos conforme necessário
        modal.style.display = "flex";
    };

    // Função para excluir visita
    window.deletarVisita = function(id) {
        if (confirm("Tem certeza que deseja excluir esta visita?")) {
            fetch(`/visitas-tecnicas/api/${id}`, { method: "DELETE" })
                .then(() => carregarVisitas())
                .catch(error => console.error("Erro ao excluir:", error));
        }
    };

    // 🔹 Carregar automaticamente ao abrir a página
    carregarVisitas();
});

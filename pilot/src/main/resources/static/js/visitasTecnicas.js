document.addEventListener("DOMContentLoaded", () => {
    const btnNovaVisita = document.getElementById("btnNovaVisita");
    const btnVisualizarVisitas = document.getElementById("btnVisualizarVisitas");
    const modal = document.getElementById("modalVisita");
    const closeModal = document.querySelector(".close");
    const visitasContainer = document.getElementById("visitasContainer");
    const visitaForm = document.getElementById("visitaForm");
    const campoPesquisa = document.getElementById("campoPesquisa");

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
                exibirVisitas(visitas);
            })
            .catch(error => console.error("Erro ao carregar visitas:", error));
    }

    // Exibir visitas
    function exibirVisitas(lista) {
        visitasContainer.innerHTML = "";
        lista.forEach(visita => {
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

    // Filtrar visitas
    campoPesquisa.addEventListener("input", () => {
        const termo = campoPesquisa.value.toLowerCase();
        const filtradas = visitas.filter(visita =>
            visita.responsavel.toLowerCase().includes(termo) ||
            visita.empresaInstituicao.toLowerCase().includes(termo) ||
            visita.localVisita.toLowerCase().includes(termo)
        );
        exibirVisitas(filtradas);
    });

    // Função para editar visita
    window.editarVisita = function(id) {
        const visita = visitas.find(v => v.id === id);
        document.getElementById("responsavel").value = visita.responsavel;
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

    btnVisualizarVisitas.onclick = carregarVisitas;
});

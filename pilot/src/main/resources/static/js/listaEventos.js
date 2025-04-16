document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalEvento");
    const btnNovoEvento = document.getElementById("btnNovoEvento");
    const btnDashboard = document.getElementById("btnDashboard");
    const closeModal = document.querySelector(".close");
    const eventoForm = document.getElementById("eventoForm");
    const eventosContainer = document.getElementById("eventosContainer");
    const numConvidadosInput = document.getElementById("numConvidados");
    const numPresentesInput = document.getElementById("numPresentes");
    const adesaoInput = document.getElementById("adesao");
    const barraPesquisa = document.getElementById("searchInput");

    let ultimoValorPresentes = 0;
    let todosEventos = []; // 🔹 Armazena todos os eventos para busca/paginação futura

    modal.style.display = "none";

    function calcularAdesao() {
        const convidados = parseInt(numConvidadosInput.value) || 0;
        let presentes = parseInt(numPresentesInput.value) || 0;

        if (presentes > convidados) {
            alert("O número de presentes não pode ser maior que o número de convidados.");
            numPresentesInput.value = ultimoValorPresentes;
            presentes = ultimoValorPresentes;
        } else {
            ultimoValorPresentes = presentes;
        }

        if (convidados > 0) {
            const adesao = ((presentes / convidados) * 100).toFixed(2);
            adesaoInput.value = `${adesao}%`;
        } else {
            adesaoInput.value = "0%";
        }
    }

    numConvidadosInput.addEventListener("input", calcularAdesao);
    numPresentesInput.addEventListener("input", calcularAdesao);

    function renderizarEventos(eventos) {
        eventosContainer.innerHTML = "";

        eventos.forEach(evento => {
            const adesaoCalculada = evento.numeroConvidados > 0
                ? ((evento.numeroPresentes / evento.numeroConvidados) * 100).toFixed(2) + "%"
                : "0%";

            const dataFormatada = new Date(evento.dataEvento).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });

            const container = document.createElement("div");
            container.classList.add("card");

            container.innerHTML = `
                <div class="face front">
                    <b>${evento.nome}</b>
                </div>
                <div class="face back">
                    <div class="content">
                        <p><strong>Tipo:</strong> ${evento.tipo}</p>
                        <p><strong>Data:</strong> ${dataFormatada}</p>
                        <p><strong>Convidados:</strong> ${evento.numeroConvidados}</p>
                        <p><strong>Presentes:</strong> ${evento.numeroPresentes}</p>
                        <p><strong>Adesão:</strong> ${adesaoCalculada}</p>
                        <div class="card-actions">
                            <button class="btn btn-edit" onclick="editarEvento(${evento.id})">Editar</button>
                            <button class="btn btn-delete" onclick="deletarEvento(${evento.id})">Excluir</button>
                        </div>
                    </div>
                </div>
            `;
            eventosContainer.appendChild(container);
        });
    }

    function carregarEventos() {
        fetch("/eventos/api")
            .then(response => response.json())
            .then(eventos => {
                todosEventos = eventos; // 🔹 Armazena para busca/paginação
                renderizarEventos(todosEventos);
            })
            .catch(error => console.error("Erro ao carregar eventos:", error));
    }

    barraPesquisa.addEventListener("input", () => {
        const termo = barraPesquisa.value.toLowerCase();
        const eventosFiltrados = todosEventos.filter(evento =>
            evento.nome.toLowerCase().includes(termo) ||
            evento.tipo.toLowerCase().includes(termo) ||
            evento.dataEvento.includes(termo)
        );
        renderizarEventos(eventosFiltrados);
    });

    carregarEventos();

    btnNovoEvento.onclick = () => {
        modal.style.display = "flex";
        document.getElementById("eventoId").value = "";
        eventoForm.reset();
        adesaoInput.value = "0%";
        ultimoValorPresentes = 0;
    };

    closeModal.onclick = () => modal.style.display = "none";

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    eventoForm.onsubmit = (e) => {
        e.preventDefault();

        const eventoId = document.getElementById("eventoId").value;
        const convidados = parseInt(numConvidadosInput.value) || 0;
        const presentes = parseInt(numPresentesInput.value) || 0;

        if (presentes > convidados) {
            alert("O número de presentes não pode ser maior que o número de convidados.");
            return;
        }

        const eventoData = {
            nome: document.getElementById("nomeEvento").value,
            tipo: document.getElementById("tipoEvento").value,
            dataEvento: document.getElementById("dataEvento").value,
            numeroConvidados: convidados,
            numeroPresentes: presentes
        };

        const url = eventoId ? `/eventos/api/${eventoId}` : "/eventos/api";
        const method = eventoId ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventoData)
        })
            .then(() => {
                modal.style.display = "none";
                carregarEventos();
            })
            .catch(error => console.error("Erro ao salvar evento:", error));
    };

    window.editarEvento = function (id) {
        fetch(`/eventos/api/${id}`)
            .then(response => response.json())
            .then(evento => {
                document.getElementById("eventoId").value = evento.id;
                document.getElementById("nomeEvento").value = evento.nome;
                document.getElementById("tipoEvento").value = evento.tipo;
                const dataOriginal = new Date(evento.dataEvento);
                const yyyy = dataOriginal.getFullYear();
                const mm = String(dataOriginal.getMonth() + 1).padStart(2, '0');
                const dd = String(dataOriginal.getDate()).padStart(2, '0');
                document.getElementById("dataEvento").value = `${yyyy}-${mm}-${dd}`;
                document.getElementById("numConvidados").value = evento.numeroConvidados;
                document.getElementById("numPresentes").value = evento.numeroPresentes;
                adesaoInput.value = ((evento.numeroPresentes / evento.numeroConvidados) * 100).toFixed(2) + "%";
                ultimoValorPresentes = evento.numeroPresentes;
                modal.style.display = "flex";
            })
            .catch(error => console.error("Erro ao carregar evento para edição:", error));
    };

    window.deletarEvento = function (id) {
        if (confirm("Tem certeza que deseja excluir este evento?")) {
            fetch(`/eventos/api/${id}`, { method: "DELETE" })
                .then(() => carregarEventos())
                .catch(error => console.error("Erro ao excluir evento:", error));
        }
    };

    if (btnDashboard) {
        btnDashboard.addEventListener("click", () => {
            window.location.href = "/eventos/dashboard";
        });
    }
});

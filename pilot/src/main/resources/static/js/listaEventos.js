document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalEvento");
    const btnNovoEvento = document.getElementById("btnNovoEvento");
    const btnDashboard = document.getElementById("btnDashboard"); // 🔹 Botão de Dashboard
    const closeModal = document.querySelector(".close");
    const eventoForm = document.getElementById("eventoForm");
    const eventosContainer = document.getElementById("eventosContainer");
    const numConvidadosInput = document.getElementById("numConvidados");
    const numPresentesInput = document.getElementById("numPresentes");
    const adesaoInput = document.getElementById("adesao");

    let ultimoValorPresentes = 0; // 🔹 Armazena o último valor válido de "Presentes"

    // Modal inicia oculto
    modal.style.display = "none";

    // Função para calcular adesão
    function calcularAdesao() {
        const convidados = parseInt(numConvidadosInput.value) || 0;
        let presentes = parseInt(numPresentesInput.value) || 0;

        // 🔹 Se presentes for maior que convidados, restaurar último valor válido
        if (presentes > convidados) {
            alert("O número de presentes não pode ser maior que o número de convidados.");
            numPresentesInput.value = ultimoValorPresentes; // 🔹 Restaurar último valor válido
            presentes = ultimoValorPresentes;
        } else {
            ultimoValorPresentes = presentes; // 🔹 Atualiza o último valor válido
        }

        if (convidados > 0) {
            const adesao = ((presentes / convidados) * 100).toFixed(2);
            adesaoInput.value = `${adesao}%`;
        } else {
            adesaoInput.value = "0%";
        }
    }

    // Atualizar adesão automaticamente ao digitar os valores
    numConvidadosInput.addEventListener("input", calcularAdesao);
    numPresentesInput.addEventListener("input", calcularAdesao);

    // Função para carregar eventos do banco e exibir na tela
    function carregarEventos() {
        fetch("/eventos/api")
            .then(response => response.json())
            .then(eventos => {
                eventosContainer.innerHTML = ""; // Limpa a lista antes de adicionar novos eventos
                eventos.forEach(evento => {
                    const adesaoCalculada = evento.numeroConvidados > 0
                        ? ((evento.numeroPresentes / evento.numeroConvidados) * 100).toFixed(2) + "%"
                        : "0%";

                    const card = document.createElement("div");
                    card.classList.add("evento-card");

                    card.innerHTML = `
                        <h3>${evento.nome}</h3>
                        <div class="detalhes">
                            <p><strong>Tipo:</strong> ${evento.tipo}</p>
                            <p><strong>Data:</strong> ${evento.dataEvento}</p>
                            <p><strong>Convidados:</strong> ${evento.numeroConvidados}</p>
                            <p><strong>Presentes:</strong> ${evento.numeroPresentes}</p>
                            <p><strong>Adesão:</strong> ${adesaoCalculada}</p>
                            <div class="card-actions">
                                <button class="btn btn-edit" onclick="editarEvento(${evento.id})">Editar</button>
                                <button class="btn btn-delete" onclick="deletarEvento(${evento.id})">Excluir</button>
                            </div>
                        </div>
                    `;
                    eventosContainer.appendChild(card);
                });
            })
            .catch(error => console.error("Erro ao carregar eventos:", error));
    }

    // Chamar carregarEventos ao carregar a página
    carregarEventos();

    // Abrir modal para criar um novo evento
    btnNovoEvento.onclick = () => {
        modal.style.display = "flex";
        document.getElementById("eventoId").value = "";
        eventoForm.reset();
        adesaoInput.value = "0%"; // Reseta o campo adesão
        ultimoValorPresentes = 0; // 🔹 Resetar último valor válido
    };

    // Fechar modal ao clicar no botão de fechar (X)
    closeModal.onclick = () => modal.style.display = "none";

    // Fechar modal ao clicar fora do conteúdo
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Envio do formulário para criar/editar evento
    eventoForm.onsubmit = (e) => {
        e.preventDefault();

        const eventoId = document.getElementById("eventoId").value;
        const convidados = parseInt(numConvidadosInput.value) || 0;
        const presentes = parseInt(numPresentesInput.value) || 0;

        // 🔹 Verificar novamente antes de enviar ao backend
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
            carregarEventos(); // 🔹 Recarregar eventos após o cadastro/edição
        })
        .catch(error => console.error("Erro ao salvar evento:", error));
    };

    /* Função para editar um evento */
    window.editarEvento = function(id) {
        fetch(`/eventos/api/${id}`)
            .then(response => response.json())
            .then(evento => {
                document.getElementById("eventoId").value = evento.id;
                document.getElementById("nomeEvento").value = evento.nome;
                document.getElementById("tipoEvento").value = evento.tipo;
                document.getElementById("dataEvento").value = evento.dataEvento;
                document.getElementById("numConvidados").value = evento.numeroConvidados;
                document.getElementById("numPresentes").value = evento.numeroPresentes;
                adesaoInput.value = ((evento.numeroPresentes / evento.numeroConvidados) * 100).toFixed(2) + "%";

                // 🔹 Salvar o valor de presentes atual como último valor válido
                ultimoValorPresentes = evento.numeroPresentes;

                modal.style.display = "flex";
            })
            .catch(error => console.error("Erro ao carregar evento para edição:", error));
    };

    /* Função para excluir um evento */
    window.deletarEvento = function(id) {
        if (confirm("Tem certeza que deseja excluir este evento?")) {
            fetch(`/eventos/api/${id}`, {
                method: "DELETE"
            })
            .then(() => {
                carregarEventos(); // 🔹 Atualiza a lista após a exclusão
            })
            .catch(error => console.error("Erro ao excluir evento:", error));
        }
    };

    if (btnDashboard) {
        btnDashboard.addEventListener("click", () => {
            console.log("Redirecionando para Dashboard...");
            window.location.href = "/eventos/dashboard";
        });
    } else {
        console.error("❌ Botão de Dashboard não encontrado!");
    }

});

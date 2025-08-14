// 🔹 Variáveis globais para acesso em todas as funções
const modal = document.getElementById("modalServico");
const btnExcluirServico = document.getElementById("btnExcluirServico");
let servicoEmEdicao = null;

// 🔐 CSRF Token e Header (inserido pelo Spring Security via metatags no HTML)
const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute("content");
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute("content");

// 🔹 FUNÇÃO PARA EDITAR SERVIÇO - Agora acessa `modal` corretamente
function editarServico(id) {
    fetch(`/servicos/api/${id}`)
        .then(response => response.json())
        .then(servico => {
            document.getElementById("cliente").value = servico.cliente;
            document.getElementById("cpfOuCnpj").value = servico.cpfOuCnpj;
            document.getElementById("endereco").value = servico.endereco;
            document.getElementById("solicitacao").value = servico.solicitacao;
            document.getElementById("quantidade").value = servico.quantidade;
            document.getElementById("status").value = servico.status;
            document.getElementById("tecnicoResponsavel").value = servico.tecnicoResponsavel;
            document.getElementById("dataPrevista").value = servico.dataExecucaoPrevista;
            document.getElementById("dataRealizada").value = servico.dataExecucaoRealizada || "";
            document.getElementById("valor").value = servico.valor;
            document.getElementById("observacao").value = servico.observacao || "";

            servicoEmEdicao = id; // Define o serviço que está sendo editado

            btnExcluirServico.style.display = "block"; // Exibe o botão excluir
            btnExcluirServico.onclick = function () {
                excluirServico(id);
            };

            modal.style.display = "flex"; // Agora `modal` está acessível
        })
        .catch(error => console.error("Erro ao buscar serviço:", error));
}

// 🔹 EXCLUIR SERVIÇO
function excluirServico(id) {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
        fetch(`/servicos/api/${id}`, {
            method: "DELETE",
            headers: {
                [csrfHeader]: csrfToken
            }
        })
            .then(() => {
                modal.style.display = "none";
                carregarServicos();
            })
            .catch(error => console.error("Erro ao excluir serviço:", error));
    }
}

// 🔹 CARREGAR LISTA DE SERVIÇOS
function carregarServicos() {
    fetch('/servicos/api')
        .then(response => response.json())
        .then(data => {
            let tabela = document.getElementById("tabelaServicos");
            tabela.innerHTML = "";

            data.forEach(servico => {
                let row = tabela.insertRow();
                row.innerHTML = `
                    <td>${servico.cliente}</td>
                    <td>${servico.solicitacao}</td>
                    <td>${servico.quantidade}</td>
                    <td>${servico.status}</td>
                    <td>${servico.tecnicoResponsavel}</td>
                    <td>${servico.dataExecucaoPrevista || "-"}</td>
                    <td>R$ ${servico.valor.toFixed(2)}</td>
                    <td>${servico.observacao || "-"}</td>
                    <td>
                        <button class="edit-button" data-id="${servico.id}">
                            <svg class="edit-svgIcon" viewBox="0 0 512 512">
                                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231z"></path>
                            </svg>
                        </button>
                    </td>
                `;
            });

            // Adiciona evento de clique para os botões de edição dinamicamente
            document.querySelectorAll(".edit-button").forEach(button => {
                button.addEventListener("click", function () {
                    let id = this.getAttribute("data-id");
                    editarServico(id);
                });
            });
        })
        .catch(error => console.error("Erro ao carregar serviços:", error));
}

// 🔹 LIMPAR FORMULÁRIO
function limparFormulario() {
    document.getElementById("cliente").value = "";
    document.getElementById("cpfOuCnpj").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("solicitacao").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("status").value = "Elaboração de proposta";
    document.getElementById("tecnicoResponsavel").value = "";
    document.getElementById("dataPrevista").value = "";
    document.getElementById("dataRealizada").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("observacao").value = "";
}


document.addEventListener("DOMContentLoaded", function () {
    carregarServicos();

    // Máscaras e validações de campos
    const cpfOuCnpjInput = document.getElementById("cpfOuCnpj");
    const tecnicoInput = document.getElementById("tecnicoResponsavel");
    const quantidadeInput = document.getElementById("quantidade");
    const valorInput = document.getElementById("valor");

    // Máscara CPF/CNPJ
    cpfOuCnpjInput.addEventListener("input", () => {
        let v = cpfOuCnpjInput.value.replace(/\D/g, "");

        // Limita o número máximo de dígitos a 14 (CNPJ)
        if (v.length > 14) v = v.slice(0, 14);

        if (v.length <= 11) {
            // CPF: 000.000.000-00
            cpfOuCnpjInput.value = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) =>
                d ? `${a}.${b}.${c}-${d}` : `${a}.${b}.${c}`
            );
        } else {
            // CNPJ: 00.000.000/0000-00
            cpfOuCnpjInput.value = v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_, a, b, c, d, e) =>
                e ? `${a}.${b}.${c}/${d}-${e}` : `${a}.${b}.${c}/${d}`
            );
        }
    });

    // Somente letras com acento para técnico
    tecnicoInput.addEventListener("input", () => {
        tecnicoInput.value = tecnicoInput.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
    });

    // Somente números inteiros
    quantidadeInput.addEventListener("input", () => {
        quantidadeInput.value = quantidadeInput.value.replace(/\D/g, "");
    });

    // Valor: somente números, vírgulas e pontos
    valorInput.addEventListener("input", () => {
        valorInput.value = valorInput.value.replace(/[^0-9.,]/g, "").replace(",", ".");
    });

    // Referência aos elementos do modal dentro do escopo correto
    const btnNovoServico = document.getElementById("btnNovoServico");
    const closeModal = document.querySelector(".close");

    // 🔹 ABRIR MODAL ao clicar no botão "+ Novo Serviço"
    if (btnNovoServico) {
        btnNovoServico.addEventListener("click", function () {
            limparFormulario();
            servicoEmEdicao = null;
            btnExcluirServico.style.display = "none";
            modal.style.display = "flex";
        });
    }

    // 🔹 FECHAR MODAL ao clicar no botão de fechar (X)
    if (closeModal) {
        closeModal.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    // 🔹 FECHAR MODAL se o usuário clicar fora da área do modal
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // 🔹 CADASTRAR OU EDITAR SERVIÇO ao submeter o formulário
    const formServico = document.getElementById("servicoForm");
    if (formServico) {
        formServico.addEventListener("submit", function (event) {
            event.preventDefault();

            let observacao = document.getElementById("observacao").value.trim();
            observacao = observacao.length > 0 ? observacao : null;

            let servico = {
                cliente: document.getElementById("cliente").value.trim(),
                cpfOuCnpj: document.getElementById("cpfOuCnpj").value.trim(),
                endereco: document.getElementById("endereco").value.trim(),
                solicitacao: document.getElementById("solicitacao").value.trim(),
                dataCriacao: new Date().toISOString().split("T")[0],
                quantidade: parseInt(document.getElementById("quantidade").value),
                status: document.getElementById("status").value,
                tecnicoResponsavel: document.getElementById("tecnicoResponsavel").value.trim(),
                dataExecucaoPrevista: document.getElementById("dataPrevista").value,
                dataExecucaoRealizada: document.getElementById("dataRealizada").value || null,
                valor: parseFloat(document.getElementById("valor").value),
                observacao: observacao
            };

            if (servicoEmEdicao) {
                fetch(`/servicos/api/${servicoEmEdicao}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        [csrfHeader]: csrfToken
                    },
                    body: JSON.stringify(servico)
                })
                    .then(response => response.json())
                    .then(() => {
                        alert("Serviço atualizado com sucesso!");
                        modal.style.display = "none";
                        carregarServicos();
                    })
                    .catch(error => console.error("Erro ao atualizar serviço:", error));
            } else {
                fetch('/servicos/api', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        [csrfHeader]: csrfToken
                    },
                    body: JSON.stringify(servico)
                })
                    .then(response => response.json())
                    .then(() => {
                        alert("Serviço cadastrado com sucesso!");
                        modal.style.display = "none";
                        carregarServicos();
                    })
                    .catch(error => console.error("Erro ao cadastrar serviço:", error));
            }
        });
    }
});

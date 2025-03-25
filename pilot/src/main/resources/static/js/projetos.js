document.addEventListener("DOMContentLoaded", function () {
    fetch("/projetos/api")
      .then(response => response.json())
      .then(data => preencherTabela(data))
      .catch(erro => console.error("Erro ao buscar projetos:", erro));
  });
  
  function preencherTabela(projetos) {
    const tbody = document.querySelector("#tabelaProjetos tbody");
    tbody.innerHTML = "";
  
    projetos.forEach(p => {
      const tr = document.createElement("tr");
  
      tr.innerHTML = `
        <td>${p.nomeProjeto}</td>
        <td>${p.responsavelNome || "-"}</td>
        <td>${p.prioridade}</td>
        <td>${p.status}</td>
        <td>${p.previsaoInicio || "-"}</td>
        <td>${p.previsaoTermino || "-"}</td>
        <td>${p.dataRealFinalizacao || "-"}</td> <!-- NOVO CAMPO -->
      `;
  
      tbody.appendChild(tr);
    });
  }
  
// Abrir/fechar modal
const modal = document.getElementById("modalProjeto");
const btnAbrirModal = document.getElementById("btnAbrirModal");
const spanFechar = document.querySelector(".fechar");

btnAbrirModal.onclick = () => {
  document.getElementById("formProjeto").reset();
  document.getElementById("tituloModal").textContent = "Cadastrar Projeto";
  modal.style.display = "block";
};

spanFechar.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

// Enviar formulário
document.getElementById("formProjeto").addEventListener("submit", function(e) {
  e.preventDefault();

  const projeto = {
    nomeProjeto: document.getElementById("nomeProjeto").value,
    objetivo: document.getElementById("objetivo").value,
    atividades: document.getElementById("atividades").value,
    responsavel: { id: parseInt(document.getElementById("responsavelId").value) || null },
    prioridade: document.getElementById("prioridade").value,
    custoAnualPrevisto: parseFloat(document.getElementById("custoAnualPrevisto").value),
    retornoPrevisto: parseFloat(document.getElementById("retornoPrevisto").value),
    status: document.getElementById("status").value,
    observacao: document.getElementById("observacao").value,
    previsaoInicio: document.getElementById("previsaoInicio").value,
    previsaoTermino: document.getElementById("previsaoTermino").value,
    dataRealFinalizacao: document.getElementById("dataRealFinalizacao").value
  };

  fetch("/projetos/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projeto)
  })
  .then(res => {
    if (res.ok) {
      alert("Projeto cadastrado com sucesso!");
      modal.style.display = "none";
      return fetch("/projetos/api").then(r => r.json()).then(preencherTabela);
    } else {
      alert("Erro ao salvar projeto.");
    }
  });
  
});

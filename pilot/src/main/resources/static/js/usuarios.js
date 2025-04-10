let usuariosGlobais = [];
let paginaAtual = 1;
const itensPorPagina = 10;

const modal = document.getElementById("modal");
const btnAbrirModal = document.getElementById("btnAbrirModal");
const btnFecharModal = document.getElementById("fecharModal");
const form = document.getElementById("formUsuario");
const tabelaBody = document.querySelector("#tabelaUsuarios tbody");

const filtroRole = document.getElementById("filtroRole");
const btnLimparFiltros = document.getElementById("btnLimparFiltros");

const btnAnterior = document.getElementById("btnAnterior");
const btnProximo = document.getElementById("btnProximo");
const paginacaoInfo = document.getElementById("paginacaoInfo");

// Eventos
window.onload = carregarUsuarios;
btnAbrirModal.onclick = () => modal.style.display = "block";
btnFecharModal.onclick = fecharModal;
window.onclick = e => { if (e.target === modal) fecharModal(); };
filtroRole.addEventListener("change", () => {
  paginaAtual = 1;
  carregarUsuarios();
});
btnLimparFiltros.onclick = () => {
  filtroRole.value = "";
  paginaAtual = 1;
  carregarUsuarios();
};

btnAnterior.onclick = () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderizarTabelaPaginada(usuariosGlobais);
  }
};

btnProximo.onclick = () => {
  const total = Math.ceil(usuariosGlobais.length / itensPorPagina);
  if (paginaAtual < total) {
    paginaAtual++;
    renderizarTabelaPaginada(usuariosGlobais);
  }
};

function fecharModal() {
  modal.style.display = "none";
  form.reset();
}

function carregarUsuarios() {
  const role = filtroRole.value;
  const url = role ? `/usuarios/api?role=${role}` : `/usuarios/api`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      usuariosGlobais = data;
      renderizarTabelaPaginada(data);
    })
    .catch(err => console.error("Erro ao buscar usuários:", err));
}

function renderizarTabelaPaginada(lista) {
  tabelaBody.innerHTML = "";

  const totalPaginas = Math.ceil(lista.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const pagina = lista.slice(inicio, fim);

  pagina.forEach(usuario => adicionarLinha(usuario));

  paginacaoInfo.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
  btnAnterior.disabled = paginaAtual === 1;
  btnProximo.disabled = paginaAtual === totalPaginas;
}

function adicionarLinha(usuario) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${usuario.nome}</td>
    <td>${usuario.email}</td>
    <td>${usuario.role}</td>
    <td>
      <button class="btn btn-edit" onclick="editarUsuario(${usuario.id})">Editar</button>
      <button class="btn btn-delete" onclick="deletarUsuario(${usuario.id})">Excluir</button>
    </td>
  `;

  tabelaBody.appendChild(tr);
}

form.onsubmit = function (e) {
  e.preventDefault();

  const usuario = {
    nome: form.nome.value,
    email: form.email.value,
    senha: form.senha.value,
    role: form.role.value
  };

  fetch("/usuarios/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  })
    .then(res => res.json())
    .then(novoUsuario => {
      carregarUsuarios();
      fecharModal();
    })
    .catch(err => console.error("Erro ao adicionar usuário:", err));
};

function deletarUsuario(id) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

  fetch(`/usuarios/api/${id}`, { method: "DELETE" })
    .then(() => carregarUsuarios())
    .catch(err => console.error("Erro ao deletar:", err));
}

function editarUsuario(id) {
  fetch(`/usuarios/api/${id}`)
    .then(res => res.json())
    .then(usuario => {
      if (!usuario) return alert("Usuário não encontrado");

      form.nome.value = usuario.nome;
      form.email.value = usuario.email;
      form.role.value = usuario.role;
      form.senha.value = "";

      modal.style.display = "block";

      form.onsubmit = function (e) {
        e.preventDefault();

        const atualizado = {
          nome: form.nome.value,
          email: form.email.value,
          senha: form.senha.value || undefined,
          role: form.role.value
        };

        fetch(`/usuarios/api/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(atualizado)
        })
          .then(() => {
            carregarUsuarios();
            fecharModal();
          })
          .catch(err => console.error("Erro ao atualizar:", err));
      };
    });
}

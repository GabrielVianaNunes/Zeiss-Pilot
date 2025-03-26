// Referências dos elementos
const modal = document.getElementById("modal");
const btnAbrirModal = document.getElementById("btnAbrirModal");
const btnFecharModal = document.getElementById("fecharModal");
const form = document.getElementById("formUsuario");
const tabelaBody = document.querySelector("#tabelaUsuarios tbody");

// Abrir o modal
btnAbrirModal.onclick = () => {
  modal.style.display = "block";
};

// Fechar o modal
btnFecharModal.onclick = () => {
  modal.style.display = "none";
  form.reset();
};

// Fechar ao clicar fora
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
    form.reset();
  }
};

// Carregar usuários ao iniciar
window.onload = listarUsuarios;

function listarUsuarios() {
  fetch("/api/usuarios")
    .then(res => res.json())
    .then(data => {
      tabelaBody.innerHTML = "";
      data.forEach(usuario => adicionarLinha(usuario));
    })
    .catch(err => console.error("Erro ao buscar usuários:", err));
}

function adicionarLinha(usuario) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${usuario.id}</td>
    <td>${usuario.nome}</td>
    <td>${usuario.email}</td>
    <td>${usuario.role}</td>
    <td>
      <button onclick="editarUsuario(${usuario.id})">Editar</button>
      <button onclick="deletarUsuario(${usuario.id})">Excluir</button>
    </td>
  `;

  tabelaBody.appendChild(tr);
}

form.onsubmit = function(event) {
  event.preventDefault();

  const usuario = {
    nome: form.nome.value,
    email: form.email.value,
    senha: form.senha.value,
    role: form.role.value
  };

  fetch("/api/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  })
    .then(res => res.json())
    .then(novoUsuario => {
      adicionarLinha(novoUsuario);
      modal.style.display = "none";
      form.reset();
    })
    .catch(err => console.error("Erro ao adicionar usuário:", err));
};

function deletarUsuario(id) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

  fetch(`/api/usuarios/${id}`, { method: "DELETE" })
    .then(() => listarUsuarios())
    .catch(err => console.error("Erro ao deletar:", err));
}

function editarUsuario(id) {
  fetch(`/api/usuarios`)
    .then(res => res.json())
    .then(usuarios => {
      const usuario = usuarios.find(u => u.id === id);
      if (!usuario) return alert("Usuário não encontrado");

      form.nome.value = usuario.nome;
      form.email.value = usuario.email;
      form.role.value = usuario.role;
      form.senha.value = "";

      modal.style.display = "block";

      form.onsubmit = function(e) {
        e.preventDefault();

        const atualizado = {
          nome: form.nome.value,
          email: form.email.value,
          senha: form.senha.value || undefined,
          role: form.role.value
        };

        fetch(`/api/usuarios/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(atualizado)
        })
          .then(() => {
            listarUsuarios();
            modal.style.display = "none";
            form.reset();
          })
          .catch(err => console.error("Erro ao atualizar:", err));
      };
    });
}
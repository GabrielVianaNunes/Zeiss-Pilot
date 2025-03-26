document.addEventListener('DOMContentLoaded', function() {
    // Abrir modal de criação
    document.getElementById('btnCriarEdital').addEventListener('click', function () {
        document.getElementById('modalTitulo').textContent = 'Criar Edital';
        document.getElementById('modalEdital').style.display = 'block';
        document.getElementById('btnRemover').style.display = 'none'; // Esconde o botão de remover
        document.body.classList.add('no-scroll'); // Desabilita a rolagem da página
    });

    // Fechar modal ao clicar no "X"
    document.querySelector('.close').addEventListener('click', function () {
        document.getElementById('modalEdital').style.display = 'none';
        document.body.classList.remove('no-scroll'); // Habilita a rolagem da página novamente
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function (event) {
        if (event.target === document.getElementById('modalEdital')) {
            document.getElementById('modalEdital').style.display = 'none';
            document.body.classList.remove('no-scroll'); // Habilita a rolagem da página novamente
        }
    });

    // Remover edital
    document.getElementById('btnRemover').addEventListener('click', function () {
        const editalId = document.getElementById('nomeEdital').getAttribute('data-id'); // Obtenha o ID do edital
        console.log('ID do edital:', editalId); // Log para depuração

        if (confirm('Tem certeza que deseja remover este edital?')) {
            fetch(`/editais/api/${editalId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    console.log('Edital removido com sucesso');
                    document.getElementById('modalEdital').style.display = 'none';
                    document.body.classList.remove('no-scroll');
                    window.location.reload(); // Recarrega a página para atualizar a lista
                } else {
                    console.error('Erro ao remover edital', response.status, response.statusText);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
        }
    });

    // Abrir modal de edição ao clicar no botão "Editar" da tabela
    document.querySelectorAll('.btn-editar').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.getElementById('modalTitulo').textContent = 'Editar Edital';
            document.getElementById('modalEdital').style.display = 'block';
            document.getElementById('btnRemover').style.display = 'inline-block'; // Mostra o botão de remover

            // Preenche os campos do modal com os dados do edital selecionado
            const row = this.closest('tr');
            document.getElementById('nomeEdital').value = row.cells[0].textContent;
            document.getElementById('instituicaoFornecedora').value = row.cells[1].textContent;
            document.getElementById('instituicaoParceira').value = row.cells[2].textContent;
            document.getElementById('status').value = row.cells[3].textContent;
            document.getElementById('valor').value = row.cells[4].textContent; // Preenche o campo valor
            document.getElementById('observacao').value = row.cells[5].textContent;

            // Armazena o ID do edital no campo nomeEdital para uso na remoção
            document.getElementById('nomeEdital').setAttribute('data-id', this.getAttribute('data-id'));
        });
    });

    // Salvar edital (criar ou editar)
    document.getElementById('formEdital').addEventListener('submit', function (event) {
        event.preventDefault();

        // Captura os valores dos campos do formulário
        const nomeEdital = document.getElementById('nomeEdital').value;
        const instituicaoFornecedora = document.getElementById('instituicaoFornecedora').value;
        const instituicaoParceira = document.getElementById('instituicaoParceira').value;
        const status = document.getElementById('status').value;
        const valor = parseFloat(document.getElementById('valor').value); // Captura o valor do campo
        const observacao = document.getElementById('observacao').value;

        // Objeto com os dados do edital
        const editalDTO = {
            nomeEdital: nomeEdital,
            instituicaoFornecedora: instituicaoFornecedora,
            instituicaoParceira: instituicaoParceira,
            status: status,
            valor: valor, // Adiciona o campo valor
            observacao: observacao
        };

        // Enviar os dados para o back-end
        fetch('/editais', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editalDTO)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao salvar edital');
            }
        })
        .then(data => {
            console.log('Edital salvo com sucesso:', data);
            // Fechar o modal após salvar
            document.getElementById('modalEdital').style.display = 'none';
            document.body.classList.remove('no-scroll'); // Habilita a rolagem da página novamente
            // Recarregar a lista de editais (opcional)
            window.location.reload();
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });
});
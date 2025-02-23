// Inicializa o Flatpickr para o campo dataEvento
flatpickr("#dataEvento", {
    dateFormat: "Y-m-d",
    locale: "pt"
});

// Função para calcular a adesão automaticamente
function calcularAdesao() {
    var numeroConvidados = parseInt(document.getElementById("numeroConvidados").value) || 0;
    var numeroPresentes = parseInt(document.getElementById("numeroPresentes").value) || 0;
    var adesaoField = document.getElementById("adesao");

    if (numeroConvidados > 0) {
        var adesao = (numeroPresentes * 100) / numeroConvidados;
        adesaoField.value = adesao.toFixed(2);
    } else {
        adesaoField.value = "0.00";
    }
}

// Adiciona eventos para atualizar a adesão em tempo real
document.getElementById("numeroConvidados").addEventListener("input", calcularAdesao);
document.getElementById("numeroPresentes").addEventListener("input", calcularAdesao);

// Previne envio do formulário para fins de demonstração
document.getElementById("formEvento").addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Evento salvo com sucesso!");
});

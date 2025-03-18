package com.zeiss.pilot.dto;

import java.math.BigDecimal;

public class ServicoDTO {

    private Long id;
    private String cliente;
    private String solicitacao;
    private int quantidade;
    private String status;
    private BigDecimal valor;
    private String observacao;

    public ServicoDTO() {}

    public ServicoDTO(Long id, String cliente, String solicitacao, int quantidade, String status, BigDecimal valor, String observacao) {
        this.id = id;
        this.cliente = cliente;
        this.solicitacao = solicitacao;
        this.quantidade = quantidade;
        this.status = status;
        this.valor = valor;
        this.observacao = observacao;
    }

    // Getters e Setters
    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public String getCliente() { 
        return cliente; 
    }

    public void setCliente(String cliente) { 
        this.cliente = cliente; 
    }

    public String getSolicitacao() { 
        return solicitacao; 
    }

    public void setSolicitacao(String solicitacao) { 
        this.solicitacao = solicitacao; 
    }

    public int getQuantidade() { 
        return quantidade; 
    }

    public void setQuantidade(int quantidade) { 
        this.quantidade = quantidade; 
    }

    public String getStatus() { 
        return status; 
    }

    public void setStatus(String status) { 
        this.status = status; 
    }

    public BigDecimal getValor() { 
        return valor; 
    }

    public void setValor(BigDecimal valor) { 
        this.valor = valor;
    }

    public String getObservacao() { 
        return observacao; 
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao != null && !observacao.trim().isEmpty() ? observacao : null;
    }
}

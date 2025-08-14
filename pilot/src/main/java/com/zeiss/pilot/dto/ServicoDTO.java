package com.zeiss.pilot.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ServicoDTO {

    private Long id;
    private String codigoOS;
    private String cliente;
    private String cpfOuCnpj;
    private String endereco;
    private String solicitacao;
    private LocalDate dataCriacao;  // Agora incluído corretamente
    private int quantidade;
    private String status;
    private String tecnicoResponsavel;
    private LocalDate dataExecucaoPrevista;
    private LocalDate dataExecucaoRealizada;
    private BigDecimal valor;
    private String observacao;

    public ServicoDTO() {
    }

    // 🔹 Construtor
    public ServicoDTO(Long id, String codigoOS, String cliente, String cpfOuCnpj, String endereco,
            String solicitacao, LocalDate dataCriacao, int quantidade, String status,
            String tecnicoResponsavel, LocalDate dataExecucaoPrevista, LocalDate dataExecucaoRealizada,
            BigDecimal valor, String observacao) {
        this.id = id;
        this.codigoOS = codigoOS;
        this.cliente = cliente;
        this.cpfOuCnpj = cpfOuCnpj;
        this.endereco = endereco;
        this.solicitacao = solicitacao;
        this.dataCriacao = dataCriacao;
        this.quantidade = quantidade;
        this.status = status;
        this.tecnicoResponsavel = tecnicoResponsavel;
        this.dataExecucaoPrevista = dataExecucaoPrevista;
        this.dataExecucaoRealizada = dataExecucaoRealizada;
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

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
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

    public String getCodigoOS() {
        return codigoOS;
    }

    public void setCodigoOS(String codigoOS) {
        this.codigoOS = codigoOS;
    }

    public String getCpfOuCnpj() {
        return cpfOuCnpj;
    }

    public void setCpfOuCnpj(String cpfOuCnpj) {
        this.cpfOuCnpj = cpfOuCnpj;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getTecnicoResponsavel() {
        return tecnicoResponsavel;
    }

    public void setTecnicoResponsavel(String tecnicoResponsavel) {
        this.tecnicoResponsavel = tecnicoResponsavel;
    }

    public LocalDate getDataExecucaoPrevista() {
        return dataExecucaoPrevista;
    }

    public void setDataExecucaoPrevista(LocalDate dataExecucaoPrevista) {
        this.dataExecucaoPrevista = dataExecucaoPrevista;
    }

    public LocalDate getDataExecucaoRealizada() {
        return dataExecucaoRealizada;
    }

    public void setDataExecucaoRealizada(LocalDate dataExecucaoRealizada) {
        this.dataExecucaoRealizada = dataExecucaoRealizada;
    }
}

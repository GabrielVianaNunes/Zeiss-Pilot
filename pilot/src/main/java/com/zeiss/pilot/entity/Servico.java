package com.zeiss.pilot.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "servicos")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_os", unique = true, nullable = false, length = 20)
    private String codigoOS;

    @Column(nullable = false)
    private String cliente;

    @Column(nullable = false)
    private String cpfOuCnpj;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String solicitacao;

    @Column(nullable = false)
    private LocalDate dataCriacao;  // Adicionado corretamente

    @Column(nullable = false)
    private int quantidade;

    @Column(nullable = false)
    private String status;

    @Column(name = "tecnico_responsavel", nullable = false)
    private String tecnicoResponsavel;

    @Column(name = "data_execucao_prevista", nullable = false)
    private LocalDate dataExecucaoPrevista;

    @Column(name = "data_execucao_realizada")
    private LocalDate dataExecucaoRealizada;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    public Servico() {
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
        this.observacao = observacao;
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

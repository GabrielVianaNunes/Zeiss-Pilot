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
@Table(name = "eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(nullable = false, length = 100)
    private String tipo;

    @Column(name = "data_evento", nullable = false)
    private LocalDate dataEvento;

    @Column(name = "numero_convidados", nullable = false)
    private int numeroConvidados;

    @Column(name = "numero_presentes", nullable = false)
    private int numeroPresentes;

    @Column(name = "adesao", precision = 5, scale = 2, nullable = false, insertable = false, updatable = false)
    private BigDecimal adesao;

    // Construtor padrão
    public Evento() {
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
  
    public String getTipo() {
        return tipo;
    }
  
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
  
    public LocalDate getDataEvento() {
        return dataEvento;
    }
  
    public void setDataEvento(LocalDate dataEvento) {
        this.dataEvento = dataEvento;
    }
  
    public int getNumeroConvidados() {
        return numeroConvidados;
    }
  
    public void setNumeroConvidados(int numeroConvidados) {
        this.numeroConvidados = numeroConvidados;
    }
  
    public int getNumeroPresentes() {
        return numeroPresentes;
    }
  
    public void setNumeroPresentes(int numeroPresentes) {
        this.numeroPresentes = numeroPresentes;
    }
  
    public BigDecimal getAdesao() {
        return adesao;
    }
  
    public void setAdesao(BigDecimal adesao) {
        this.adesao = adesao;
    }
}

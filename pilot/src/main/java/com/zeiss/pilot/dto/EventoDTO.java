package com.zeiss.pilot.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.zeiss.pilot.entity.Evento;

public class EventoDTO {

    private Long id;
    private String nome;
    private String tipo;
    private LocalDate dataEvento;
    private int numeroConvidados;
    private int numeroPresentes;
    private BigDecimal adesao;

    public EventoDTO() {
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

    // Método para converter uma entidade Evento em EventoDTO
    public static EventoDTO fromEntity(Evento evento) {
        EventoDTO dto = new EventoDTO();
        dto.setId(evento.getId());
        dto.setNome(evento.getNome());
        dto.setTipo(evento.getTipo());
        dto.setDataEvento(evento.getDataEvento());
        dto.setNumeroConvidados(evento.getNumeroConvidados());
        dto.setNumeroPresentes(evento.getNumeroPresentes());
        dto.setAdesao(evento.getAdesao());
        return dto;
    }

    // Método para converter o DTO em uma entidade Evento
    public Evento toEntity() {
        Evento evento = new Evento();
        evento.setNome(this.getNome());
        evento.setTipo(this.getTipo());
        evento.setDataEvento(this.getDataEvento());
        evento.setNumeroConvidados(this.getNumeroConvidados());
        evento.setNumeroPresentes(this.getNumeroPresentes());
        // O campo adesao é calculado automaticamente pelo banco de dados
        return evento;
    }
}

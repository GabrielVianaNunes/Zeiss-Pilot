package com.zeiss.pilot.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zeiss.pilot.dto.EventoDTO;
import com.zeiss.pilot.entity.Evento;
import com.zeiss.pilot.repository.EventoRepository;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    public List<EventoDTO> getAllEventos() {
        List<Evento> eventos = eventoRepository.findAll();
        return eventos.stream()
                      .map(EventoDTO::fromEntity)
                      .collect(Collectors.toList());
    }

    public EventoDTO getEventoById(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado com id: " + id));
        return EventoDTO.fromEntity(evento);
    }

    public EventoDTO createEvento(EventoDTO eventoDTO) {
        Evento evento = eventoDTO.toEntity();
        Evento savedEvento = eventoRepository.save(evento);
        return EventoDTO.fromEntity(savedEvento);
    }

    public EventoDTO updateEvento(Long id, EventoDTO eventoDTO) {
        Evento existingEvento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado com id: " + id));

        existingEvento.setNome(eventoDTO.getNome());
        existingEvento.setTipo(eventoDTO.getTipo());
        existingEvento.setDataEvento(eventoDTO.getDataEvento());
        existingEvento.setNumeroConvidados(eventoDTO.getNumeroConvidados());
        existingEvento.setNumeroPresentes(eventoDTO.getNumeroPresentes());
        // O campo adesao é calculado automaticamente no banco

        Evento updatedEvento = eventoRepository.save(existingEvento);
        return EventoDTO.fromEntity(updatedEvento);
    }

    public void deleteEvento(Long id) {
        Evento existingEvento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado com id: " + id));
        eventoRepository.delete(existingEvento);
    }
}

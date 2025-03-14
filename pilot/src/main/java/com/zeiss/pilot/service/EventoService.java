package com.zeiss.pilot.service;

import java.time.Month;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zeiss.pilot.dto.EventoDTO;
import com.zeiss.pilot.dto.EventoRelatorioDTO;
import com.zeiss.pilot.entity.Evento;
import com.zeiss.pilot.repository.EventoRepository;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    public List<EventoDTO> getAllEventos() {
        return eventoRepository.findAll()
                               .stream()
                               .map(EventoDTO::fromEntity)
                               .collect(Collectors.toList());
    }

    public EventoDTO getEventoById(Long id) {
        return eventoRepository.findById(id)
                .map(EventoDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado com id: " + id));
    }

    public EventoDTO createEvento(EventoDTO eventoDTO) {
        Evento evento = eventoDTO.toEntity();
        evento = eventoRepository.save(evento);
        return EventoDTO.fromEntity(evento);
    }

    public EventoDTO updateEvento(Long id, EventoDTO eventoDTO) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado com id: " + id));

        evento.setNome(eventoDTO.getNome());
        evento.setTipo(eventoDTO.getTipo());
        evento.setDataEvento(eventoDTO.getDataEvento());
        evento.setNumeroConvidados(eventoDTO.getNumeroConvidados());
        evento.setNumeroPresentes(eventoDTO.getNumeroPresentes());

        evento = eventoRepository.save(evento);
        return EventoDTO.fromEntity(evento);
    }

    public void deleteEvento(Long id) {
        eventoRepository.deleteById(id);
    }

    // 🔹 Método para calcular os relatórios de eventos
    public EventoRelatorioDTO getRelatoriosEventos() {
        List<Evento> eventos = eventoRepository.findAll();

        long totalEventos = eventos.size();
        double adesaoMedia = eventos.stream()
                .filter(e -> e.getNumeroConvidados() > 0)
                .mapToDouble(e -> (double) e.getNumeroPresentes() / e.getNumeroConvidados() * 100)
                .average()
                .orElse(0.0);

        // Distribuição mensal
        Map<String, Long> distribuicaoMensal = new HashMap<>();
        for (Month mes : Month.values()) {
            distribuicaoMensal.put(mes.toString(), 0L);
        }

        eventos.forEach(evento -> {
            String mes = evento.getDataEvento().getMonth().toString();
            distribuicaoMensal.put(mes, distribuicaoMensal.getOrDefault(mes, 0L) + 1);
        });

        return new EventoRelatorioDTO(totalEventos, adesaoMedia, distribuicaoMensal);
    }
}

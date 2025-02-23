package com.zeiss.pilot.controller;

import com.zeiss.pilot.dto.EventoDTO;
import com.zeiss.pilot.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller // Alterado de @RestController para @Controller para suportar Thymeleaf
@RequestMapping("/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    // 🟢 Rota para exibir a página de eventos (Thymeleaf)
    @GetMapping
    public String listarEventos(Model model) {
        List<EventoDTO> eventos = eventoService.getAllEventos();
        model.addAttribute("eventos", eventos); // Adiciona eventos à página
        return "eventos"; // Retorna a página eventos.html
    }

    // 🟢 API REST: Retorna a lista de eventos em formato JSON
    @GetMapping("/api")
    @ResponseBody
    public List<EventoDTO> getAllEventos() {
        return eventoService.getAllEventos();
    }

    // 🟢 API REST: Busca evento por ID (JSON)
    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<EventoDTO> getEventoById(@PathVariable Long id) {
        EventoDTO eventoDTO = eventoService.getEventoById(id);
        return ResponseEntity.ok(eventoDTO);
    }

    // 🟢 API REST: Criar evento (JSON)
    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<EventoDTO> createEvento(@RequestBody EventoDTO eventoDTO) {
        EventoDTO createdEvento = eventoService.createEvento(eventoDTO);
        return ResponseEntity.ok(createdEvento);
    }

    // 🟢 API REST: Atualizar evento (JSON)
    @PutMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<EventoDTO> updateEvento(@PathVariable Long id, @RequestBody EventoDTO eventoDTO) {
        EventoDTO updatedEvento = eventoService.updateEvento(id, eventoDTO);
        return ResponseEntity.ok(updatedEvento);
    }

    // 🟢 API REST: Deletar evento
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        eventoService.deleteEvento(id);
        return ResponseEntity.noContent().build();
    }
}

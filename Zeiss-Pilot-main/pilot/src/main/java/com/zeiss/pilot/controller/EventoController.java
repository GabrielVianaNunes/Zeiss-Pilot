package com.zeiss.pilot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zeiss.pilot.dto.EventoDTO;
import com.zeiss.pilot.dto.EventoRelatorioDTO;
import com.zeiss.pilot.service.EventoService;

@Controller
@RequestMapping("/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    // 🔹 Exibir página única para gerenciar eventos
    @GetMapping("/listar")
    public String listarEventos(Model model) {
        List<EventoDTO> eventos = eventoService.getAllEventos();
        model.addAttribute("eventos", eventos);
        return "lista-eventos"; // Página única para CRUD
    }

    // 🔹 API REST: Listar eventos (JSON)
    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<EventoDTO>> getAllEventos() {
        return ResponseEntity.ok(eventoService.getAllEventos());
    }

    // 🔹 API REST: Buscar evento por ID
    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<EventoDTO> getEventoById(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.getEventoById(id));
    }

    // 🔹 API REST: Criar um evento
    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<EventoDTO> createEvento(@RequestBody EventoDTO eventoDTO) {
        return ResponseEntity.ok(eventoService.createEvento(eventoDTO));
    }

    // 🔹 API REST: Atualizar um evento
    @PutMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<EventoDTO> updateEvento(@PathVariable Long id, @RequestBody EventoDTO eventoDTO) {
        return ResponseEntity.ok(eventoService.updateEvento(id, eventoDTO));
    }

    // 🔹 API REST: Deletar um evento
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        eventoService.deleteEvento(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/relatorios")
    @ResponseBody
    public ResponseEntity<EventoRelatorioDTO> getRelatoriosEventos() {
        return ResponseEntity.ok(eventoService.getRelatoriosEventos());
    }

    @GetMapping("/dashboard")
    public String dashboardEventos() {
        return "dashboardEventos"; // Nome do arquivo HTML sem a extensão
    }

}

package com.zeiss.pilot.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.zeiss.pilot.dto.VisitaTecnicaDTO;
import com.zeiss.pilot.entity.VisitaTecnica;
import com.zeiss.pilot.service.VisitaTecnicaService;

@Controller
@RequestMapping("/visitas-tecnicas")
public class VisitaTecnicaController {

    @Autowired
    private VisitaTecnicaService service;

    // ✅ Apenas retorna a página, sem carregar dados no modelo
    @GetMapping
    public String listarVisitas() {
        return "visitasTecnicas";
    }

    // ✅ API REST: Retornar visitas técnicas como JSON
    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<VisitaTecnicaDTO>> getAllVisitas() {
        List<VisitaTecnica> visitas = service.listarVisitas();
        List<VisitaTecnicaDTO> dtos = visitas.stream()
                                             .map(VisitaTecnicaDTO::fromEntity)
                                             .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ✅ API REST: Criar uma nova visita técnica
    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<VisitaTecnicaDTO> salvarVisita(@RequestBody VisitaTecnicaDTO dto) {
        VisitaTecnica entidade = dto.toEntity();
        VisitaTecnica salvo = service.salvarVisita(entidade);
        return ResponseEntity.ok(VisitaTecnicaDTO.fromEntity(salvo));
    }

    // ✅ API REST: Atualizar visita técnica existente
    @PutMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<VisitaTecnicaDTO> atualizarVisita(@PathVariable Long id, @RequestBody VisitaTecnicaDTO dto) {
        VisitaTecnica entidade = dto.toEntity();
        entidade.setId(id);
        VisitaTecnica atualizado = service.salvarVisita(entidade);
        return ResponseEntity.ok(VisitaTecnicaDTO.fromEntity(atualizado));
    }

    // ✅ API REST: Excluir visita técnica
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<Void> deletarVisita(@PathVariable Long id) {
        service.deletarVisita(id);
        return ResponseEntity.noContent().build();
    }
}

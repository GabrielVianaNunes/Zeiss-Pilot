package com.zeiss.pilot.controller;

import java.util.List;

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

import com.zeiss.pilot.dto.EditalDTO;
import com.zeiss.pilot.service.EditalService;

@Controller
@RequestMapping("/editais")
public class EditalController {

    private final EditalService editalService;

    public EditalController(EditalService editalService) {
        this.editalService = editalService;
    }

    /* ========== ROTAS PARA THYMELEAF ========== */

    @GetMapping("/lista")
    public String listarEditais(Model model) {
        model.addAttribute("editais", editalService.listarTodos());
        return "lista-editais";
    }

    @GetMapping("/detalhes/{id}")
    public String detalhesEdital(@PathVariable Long id, Model model) {
        EditalDTO edital = editalService.buscarPorId(id);
        model.addAttribute("edital", edital);
        return "detalhes-edital";
    }

    /* ========== API REST ========== */

    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<EditalDTO> criarEdital(@RequestBody EditalDTO editalDTO) {
        try {
            EditalDTO novoEdital = editalService.criarEdital(editalDTO);
            return ResponseEntity.ok(novoEdital);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<EditalDTO> atualizarEdital(
            @PathVariable Long id,
            @RequestBody EditalDTO editalDTO) {
        try {
            if (!id.equals(editalDTO.getId())) {
                editalDTO.setId(id);
            }
            EditalDTO editalAtualizado = editalService.atualizarEdital(id, editalDTO);
            return ResponseEntity.ok(editalAtualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<Void> excluirEdital(@PathVariable Long id) {
        try {
            editalService.excluirEdital(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<EditalDTO>> listarTodosApi() {
        return ResponseEntity.ok(editalService.listarTodos());
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<EditalDTO> buscarPorIdApi(@PathVariable Long id) {
        EditalDTO edital = editalService.buscarPorId(id);
        return edital != null ? ResponseEntity.ok(edital) : ResponseEntity.notFound().build();
    }
}
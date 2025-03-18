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

import com.zeiss.pilot.dto.ServicoDTO;
import com.zeiss.pilot.service.ServicoService;

@Controller
@RequestMapping("/servicos")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    // 🔹 Exibir página "servicos.html"
    @GetMapping
    public String mostrarPaginaServicos(Model model) {
        List<ServicoDTO> servicos = servicoService.listarTodos();
        model.addAttribute("servicos", servicos);
        return "servicos"; // Nome do arquivo HTML (sem .html)
    }

    // 🔹 API REST: Listar serviços (JSON)
    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<ServicoDTO>> listarTodosServicos() {
        return ResponseEntity.ok(servicoService.listarTodos());
    }

    // 🔹 API REST: Buscar serviço por ID
    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<ServicoDTO> buscarServicoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(servicoService.buscarPorId(id));
    }

    // 🔹 API REST: Criar um novo serviço
    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<ServicoDTO> criarServico(@RequestBody ServicoDTO servicoDTO) {
        if (servicoDTO.getObservacao() != null && servicoDTO.getObservacao().trim().isEmpty()) {
            servicoDTO.setObservacao(null);
        }
        return ResponseEntity.ok(servicoService.criarServico(servicoDTO));
    }

    // 🔹 API REST: Atualizar um serviço
    @PutMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<ServicoDTO> atualizarServico(@PathVariable Long id, @RequestBody ServicoDTO servicoDTO) {
        return ResponseEntity.ok(servicoService.atualizarServico(id, servicoDTO));
    }

    // 🔹 API REST: Excluir um serviço
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<Void> excluirServico(@PathVariable Long id) {
        servicoService.excluirServico(id);
        return ResponseEntity.noContent().build();
    }
}

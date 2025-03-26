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

    @GetMapping("/lista")
    public String listarEditais(Model model) {
        List<EditalDTO> editais = editalService.listarTodos();
        model.addAttribute("editais", editais);
        return "lista-editais";
    }

    @GetMapping("/detalhes/{id}")
    public String detalhesEdital(@PathVariable Long id, Model model) {
        EditalDTO edital = editalService.buscarPorId(id);
        model.addAttribute("edital", edital);
        return "detalhes-edital";
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<EditalDTO> criarEdital(@RequestBody EditalDTO editalDTO) {
        EditalDTO editalCriado = editalService.criarEdital(editalDTO);
        return ResponseEntity.ok(editalCriado);
    }

    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<EditalDTO>> listarTodosApi() {
        List<EditalDTO> editais = editalService.listarTodos();
        return ResponseEntity.ok(editais);
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<EditalDTO> buscarPorIdApi(@PathVariable Long id) {
        EditalDTO edital = editalService.buscarPorId(id);
        return ResponseEntity.ok(edital);
    }

    @PutMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<EditalDTO> atualizarEditalApi(@PathVariable Long id, @RequestBody EditalDTO editalDTO) {
        EditalDTO editalAtualizado = editalService.atualizarEdital(id, editalDTO);
        return ResponseEntity.ok(editalAtualizado);
    }

    @DeleteMapping("/api/{id}")
@ResponseBody
public ResponseEntity<Void> excluirEditalApi(@PathVariable Long id) {
    try {
        editalService.excluirEdital(id);
        return ResponseEntity.noContent().build(); // Retorna 204 (No Content) em caso de sucesso
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build(); // Retorna 404 (Not Found) se o edital não existir
    } catch (Exception e) {
        return ResponseEntity.internalServerError().build(); // Retorna 500 (Internal Server Error) para outros erros
    }
}

}
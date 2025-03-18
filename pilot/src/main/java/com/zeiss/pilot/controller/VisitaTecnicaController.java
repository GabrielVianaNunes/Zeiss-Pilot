package com.zeiss.pilot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zeiss.pilot.entity.VisitaTecnica;
import com.zeiss.pilot.service.VisitaTecnicaService;

@Controller
@RequestMapping("/visitas-tecnicas")
public class VisitaTecnicaController {

    @Autowired
    private VisitaTecnicaService service;

    // 🔹 Exibir a página HTML "visitasTecnicas.html"
    @GetMapping
    public String listarVisitas(Model model) {
        List<VisitaTecnica> visitas = service.listarVisitas();
        model.addAttribute("visitas", visitas);
        return "visitasTecnicas"; // Retorna a página HTML na pasta templates/
    }

    // 🔹 API REST: Retornar visitas técnicas como JSON
    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<VisitaTecnica>> getAllVisitas() {
        return ResponseEntity.ok(service.listarVisitas());
    }

    // 🔹 API REST: Criar uma nova visita técnica
    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<VisitaTecnica> salvarVisita(@RequestBody VisitaTecnica visita) {
        return ResponseEntity.ok(service.salvarVisita(visita));
    }
}

package com.zeiss.pilot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PageController {

    // Página inicial
    @GetMapping
    public String paginaInicial() {
        return "index";
    }

    // Página de Projetos
    @GetMapping("/projetos")
    public String paginaProjetos() {
        return "projetos";
    }

    // Página de Usuários
    @GetMapping("/usuarios")
    public String paginaUsuarios() {
        return "usuarios";
    }

}

package com.zeiss.pilot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PageController {
    
    @GetMapping
    public String paginaInicial() {
        return "index";
    }

    @GetMapping("/projetos")
    public String paginaProjetos() {
        return "projetos";
    }

    @GetMapping("/usuarios")
    public String paginaUsuarios() {
        return "usuarios";
    }

    @GetMapping("/index") // Adicionada na Solução 1
    public String redirecionarParaPaginaInicial() {
        return "index";
    }
}


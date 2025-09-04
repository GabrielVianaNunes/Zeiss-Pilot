package com.zeiss.pilot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.zeiss.pilot.repository.UsuarioRepository;

@Controller
@RequestMapping("/")
public class PageController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
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

    @GetMapping("/index") 
    public String redirecionarParaPaginaInicial() {
        return "index";
    }

    @GetMapping("/documentos")
    public String paginaDocumentos(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        String email = userDetails.getUsername();
        usuarioRepository.findByEmail(email).ifPresent(usuario ->
            model.addAttribute("usuarioId", usuario.getId())
        );
        return "documentos";
    }

    @GetMapping("/pastas")
    public String paginaPastas() {
        return "pastas"; 
    }

    @GetMapping("/documentosPorSubpasta")
    public String paginaDocumentosPorSubpasta() {
        return "documentosPorSubpasta";
    }

}


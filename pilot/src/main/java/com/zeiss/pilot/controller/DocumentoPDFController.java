package com.zeiss.pilot.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zeiss.pilot.dto.DocumentoPDFDTO;
import com.zeiss.pilot.entity.Usuario;
import com.zeiss.pilot.service.DocumentoPDFService;
import com.zeiss.pilot.service.UsuarioService;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoPDFController {

    @Autowired
    private DocumentoPDFService service;

    @Autowired
    private UsuarioService usuarioService;


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DocumentoPDFDTO criar(
        @RequestParam("arquivo") MultipartFile arquivo,
        @RequestParam("dataExpiracao") String dataExpiracao
    ) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // geralmente o e-mail
        Usuario usuario = usuarioService.buscarPorEmail(email); // método já existente
        return service.salvarArquivo(arquivo, LocalDate.parse(dataExpiracao), usuario);
    }


    @GetMapping("/usuario/{usuarioId}")
    public List<DocumentoPDFDTO> listarPorUsuario(@PathVariable Long usuarioId) {
        return service.listarPorUsuario(usuarioId);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        service.remover(id);
    }

    @PutMapping("/{id}/expiracao")
    public DocumentoPDFDTO atualizarExpiracao(@PathVariable Long id, @RequestParam("data") String data) {
        return service.editarDataExpiracao(id, LocalDate.parse(data));
    }

    @GetMapping("/usuario/meus")
    public List<DocumentoPDFDTO> listarMeusDocumentos(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String nome
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioService.buscarPorEmail(email);
        return service.listarPorUsuarioComFiltro(usuario.getId(), status, nome);
    }

}

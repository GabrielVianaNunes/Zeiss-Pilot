package com.zeiss.pilot.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.zeiss.pilot.dto.UsuarioDTO;
import com.zeiss.pilot.entity.Usuario;
import com.zeiss.pilot.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔹 API REST: Listar usuários
    @GetMapping("/api")
    @ResponseBody
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios(@RequestParam(required = false) String role) {
        if (role != null && !role.isEmpty()) {
            return ResponseEntity.ok(usuarioService.listarUsuariosPorRole(role));
        } else {
            return ResponseEntity.ok(usuarioService.listarUsuarios());
        }
    }

    // 🔹 API REST: Criar novo usuário
    @PostMapping("/api")
    public ResponseEntity<UsuarioDTO> criarUsuario(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.criarUsuario(usuario));
    }

    // 🔹 API REST: Atualizar usuário
    @PutMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<UsuarioDTO> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, usuario));
    }

    // 🔹 API REST: Excluir usuário
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    // 🔒 Endpoint seguro: Retorna somente usuários ADMIN
    @GetMapping("/api/admins")
    @ResponseBody
    public ResponseEntity<List<UsuarioDTO>> listarApenasAdmins() {
        return ResponseEntity.ok(usuarioService.listarUsuariosPorRole("ADMIN"));
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<UsuarioDTO> buscarUsuarioPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping("/api/validar-senha-admin")
    public ResponseEntity<Boolean> validarSenhaAdmin(@RequestBody Map<String, String> payload, Principal principal) {
        String senhaDigitada = payload.get("senha");
        String email = principal.getName(); 
        Usuario usuario = usuarioService.buscarPorEmail(email);
        boolean senhaCorreta = passwordEncoder.matches(senhaDigitada, usuario.getSenha());
        return ResponseEntity.ok(senhaCorreta);
    }


}

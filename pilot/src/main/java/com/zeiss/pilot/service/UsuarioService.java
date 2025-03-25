package com.zeiss.pilot.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zeiss.pilot.dto.UsuarioDTO;
import com.zeiss.pilot.entity.Usuario;
import com.zeiss.pilot.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioDTO criarUsuario(Usuario usuario) {
        Usuario salvo = usuarioRepository.save(usuario);
        return new UsuarioDTO(salvo.getId(), salvo.getNome());
    }

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(u -> new UsuarioDTO(u.getId(), u.getNome()))
                .collect(Collectors.toList());
    }

    public Optional<UsuarioDTO> buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(u -> new UsuarioDTO(u.getId(), u.getNome()));
    }

    public boolean excluirUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public UsuarioDTO atualizarUsuario(Long id, Usuario usuarioAtualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setSenha(usuarioAtualizado.getSenha());
                    Usuario atualizado = usuarioRepository.save(usuario);
                    return new UsuarioDTO(atualizado.getId(), atualizado.getNome());
                })
                .orElse(null);
    }
}

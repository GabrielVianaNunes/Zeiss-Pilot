package com.zeiss.pilot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zeiss.pilot.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmail(String email);
}

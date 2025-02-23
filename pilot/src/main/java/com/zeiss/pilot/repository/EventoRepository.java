package com.zeiss.pilot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zeiss.pilot.entity.Evento;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
}

package com.zeiss.pilot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zeiss.pilot.entity.VisitaTecnica;
import com.zeiss.pilot.repository.VisitaTecnicaRepository;

@Service
public class VisitaTecnicaService {

    @Autowired
    private VisitaTecnicaRepository repository;

    public List<VisitaTecnica> listarVisitas() {
        return repository.findAll();
    }

    public VisitaTecnica salvarVisita(VisitaTecnica visita) {
        return repository.save(visita);
    }
}

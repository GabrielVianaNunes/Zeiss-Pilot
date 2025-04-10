package com.zeiss.pilot.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zeiss.pilot.dto.ProjetoDTO;
import com.zeiss.pilot.entity.Projeto;
import com.zeiss.pilot.repository.ProjetoRepository;
import com.zeiss.pilot.repository.UsuarioRepository;

@Service
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;

    public ProjetoService(ProjetoRepository projetoRepository, UsuarioRepository usuarioRepository) {
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public ProjetoDTO criarProjeto(Projeto projeto) {
        if (projeto.getResponsavel() != null && projeto.getResponsavel().getId() != null) {
            usuarioRepository.findById(projeto.getResponsavel().getId()).ifPresent(projeto::setResponsavel);
        } else {
            projeto.setResponsavel(null); 
        }
    
        Projeto salvo = projetoRepository.save(projeto);
        return toDTO(salvo);
    }    

    public List<ProjetoDTO> listarProjetos() {
        return projetoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProjetoDTO> buscarPorId(Long id) {
        return projetoRepository.findById(id).map(this::toDTO);
    }

    public boolean excluirProjeto(Long id) {
        if (projetoRepository.existsById(id)) {
            projetoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public ProjetoDTO atualizarProjeto(Long id, Projeto novo) {
        return projetoRepository.findById(id).map(projeto -> {
            projeto.setNomeProjeto(novo.getNomeProjeto());
            projeto.setObjetivo(novo.getObjetivo());
            projeto.setAtividades(novo.getAtividades());
    
            if (novo.getResponsavel() != null && novo.getResponsavel().getId() != null) {
                usuarioRepository.findById(novo.getResponsavel().getId())
                    .ifPresent(projeto::setResponsavel);
            } else {
                projeto.setResponsavel(null);
            }
    
            projeto.setPrioridade(novo.getPrioridade());
            projeto.setCustoAnualPrevisto(novo.getCustoAnualPrevisto());
            projeto.setRetornoPrevisto(novo.getRetornoPrevisto());
            projeto.setStatus(novo.getStatus());
            projeto.setObservacao(novo.getObservacao());
            projeto.setPrevisaoInicio(novo.getPrevisaoInicio());
            projeto.setPrevisaoTermino(novo.getPrevisaoTermino());
            projeto.setDataRealFinalizacao(novo.getDataRealFinalizacao());
            return toDTO(projetoRepository.save(projeto));
        }).orElse(null);
    }    

    private ProjetoDTO toDTO(Projeto projeto) {
        ProjetoDTO dto = new ProjetoDTO();
        dto.setId(projeto.getId());
        dto.setNomeProjeto(projeto.getNomeProjeto());
        dto.setObjetivo(projeto.getObjetivo());
        dto.setAtividades(projeto.getAtividades());
        dto.setResponsavelId(projeto.getResponsavel() != null ? projeto.getResponsavel().getId() : null);
        dto.setResponsavelNome(projeto.getResponsavel() != null ? projeto.getResponsavel().getNome() : null);
        dto.setPrioridade(projeto.getPrioridade());
        dto.setCustoAnualPrevisto(projeto.getCustoAnualPrevisto());
        dto.setRetornoPrevisto(projeto.getRetornoPrevisto());
        dto.setStatus(projeto.getStatus());
        dto.setObservacao(projeto.getObservacao());
        dto.setPrevisaoInicio(projeto.getPrevisaoInicio());
        dto.setPrevisaoTermino(projeto.getPrevisaoTermino());
        dto.setDataRealFinalizacao(projeto.getDataRealFinalizacao());
        return dto;
    }
}

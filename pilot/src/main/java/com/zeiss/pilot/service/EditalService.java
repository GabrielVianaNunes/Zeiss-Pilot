package com.zeiss.pilot.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zeiss.pilot.dto.EditalDTO;
import com.zeiss.pilot.entity.Edital;
import com.zeiss.pilot.repository.EditalRepository;

@Service
public class EditalService {

    private final EditalRepository editalRepository;

    public EditalService(EditalRepository editalRepository) {
        this.editalRepository = editalRepository;
    }

    public List<EditalDTO> listarTodos() {
        return editalRepository.findAll().stream()
                .map(edital -> new EditalDTO(edital))
                .collect(Collectors.toList());
    }

    public EditalDTO buscarPorId(Long id) {
        return editalRepository.findById(id)
                .map(EditalDTO::new)
                .orElse(null);
    }

    public EditalDTO criarEdital(EditalDTO editalDTO) {
        Edital edital = new Edital();
        edital.setNomeEdital(editalDTO.getNomeEdital());
        edital.setInstituicaoFornecedora(editalDTO.getInstituicaoFornecedora());
        edital.setInstituicaoParceira(editalDTO.getInstituicaoParceira());
        edital.setStatus(editalDTO.getStatus());
        edital.setValor(editalDTO.getValor());
        edital.setObservacao(editalDTO.getObservacao());

        Edital salvo = editalRepository.save(edital);
        return new EditalDTO(salvo);
    }

    public EditalDTO atualizarEdital(Long id, EditalDTO editalDTO) {
        return editalRepository.findById(id)
                .map(edital -> {
                    edital.setNomeEdital(editalDTO.getNomeEdital());
                    edital.setInstituicaoFornecedora(editalDTO.getInstituicaoFornecedora());
                    edital.setInstituicaoParceira(editalDTO.getInstituicaoParceira());
                    edital.setStatus(editalDTO.getStatus());
                    edital.setValor(editalDTO.getValor());
                    edital.setObservacao(editalDTO.getObservacao());
                    return new EditalDTO(editalRepository.save(edital));
                })
                .orElse(null);
    }

    public void excluirEdital(Long id) {
        if (!editalRepository.existsById(id)) {
            throw new RuntimeException("Edital não encontrado com o ID: " + id);
        }
        editalRepository.deleteById(id);
        System.out.println("Edital com ID " + id + " excluído com sucesso.");
    }

}
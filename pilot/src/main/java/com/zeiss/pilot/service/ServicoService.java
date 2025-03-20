package com.zeiss.pilot.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zeiss.pilot.dto.RelatorioMensalDTO;
import com.zeiss.pilot.dto.ServicoDTO;
import com.zeiss.pilot.entity.Servico;
import com.zeiss.pilot.repository.ServicoRepository;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    public List<ServicoDTO> listarTodos() {
        return servicoRepository.findAll().stream()
                .map(servico -> new ServicoDTO(
                        servico.getId(), servico.getCliente(), servico.getSolicitacao(),
                        servico.getDataCriacao(), servico.getQuantidade(), servico.getStatus(),
                        servico.getValor(), servico.getObservacao()))
                .collect(Collectors.toList());
    }

    public ServicoDTO buscarPorId(Long id) {
        Optional<Servico> servico = servicoRepository.findById(id);
        return servico.map(s -> new ServicoDTO(
                s.getId(), s.getCliente(), s.getSolicitacao(),
                s.getDataCriacao(), s.getQuantidade(), s.getStatus(),
                s.getValor(), s.getObservacao()))
                .orElse(null);
    }

    public ServicoDTO criarServico(ServicoDTO servicoDTO) {
        Servico servico = new Servico();
        servico.setCliente(servicoDTO.getCliente());
        servico.setSolicitacao(servicoDTO.getSolicitacao());
        servico.setDataCriacao(servicoDTO.getDataCriacao()); // ✅ Agora inclui a data manualmente
        servico.setQuantidade(servicoDTO.getQuantidade());
        servico.setStatus(servicoDTO.getStatus());
        servico.setValor(servicoDTO.getValor());
        servico.setObservacao(servicoDTO.getObservacao());

        Servico salvo = servicoRepository.save(servico);
        return new ServicoDTO(salvo.getId(), salvo.getCliente(), salvo.getSolicitacao(),
                salvo.getDataCriacao(), salvo.getQuantidade(), salvo.getStatus(),
                salvo.getValor(), salvo.getObservacao());
    }

    public ServicoDTO atualizarServico(Long id, ServicoDTO servicoDTO) {
        Optional<Servico> optionalServico = servicoRepository.findById(id);
        if (optionalServico.isPresent()) {
            Servico servico = optionalServico.get();
            servico.setCliente(servicoDTO.getCliente());
            servico.setSolicitacao(servicoDTO.getSolicitacao());
            servico.setDataCriacao(servicoDTO.getDataCriacao()); // ✅ Mantém a data correta
            servico.setQuantidade(servicoDTO.getQuantidade());
            servico.setStatus(servicoDTO.getStatus());
            servico.setValor(servicoDTO.getValor());
            servico.setObservacao(servicoDTO.getObservacao());
            servicoRepository.save(servico);
            return new ServicoDTO(servico.getId(), servico.getCliente(), servico.getSolicitacao(),
                    servico.getDataCriacao(), servico.getQuantidade(), servico.getStatus(),
                    servico.getValor(), servico.getObservacao());
        }
        return null;
    }

    public List<RelatorioMensalDTO> obterRelatorioMensal() {
        return servicoRepository.calcularArrecadacaoMensal();
    }

    public void excluirServico(Long id) {
        servicoRepository.deleteById(id);
    }
}

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
                servico.getId(), servico.getCodigoOS(), servico.getCliente(), servico.getCpfOuCnpj(),
                servico.getEndereco(), servico.getSolicitacao(), servico.getDataCriacao(),
                servico.getQuantidade(), servico.getStatus(), servico.getTecnicoResponsavel(),
                servico.getDataExecucaoPrevista(), servico.getDataExecucaoRealizada(),
                servico.getValor(), servico.getObservacao()))
                .collect(Collectors.toList());
    }

    public ServicoDTO buscarPorId(Long id) {
        Optional<Servico> servico = servicoRepository.findById(id);
        return servico.map(s -> new ServicoDTO(
                s.getId(), s.getCodigoOS(), s.getCliente(), s.getCpfOuCnpj(), s.getEndereco(),
                s.getSolicitacao(), s.getDataCriacao(), s.getQuantidade(), s.getStatus(),
                s.getTecnicoResponsavel(), s.getDataExecucaoPrevista(), s.getDataExecucaoRealizada(),
                s.getValor(), s.getObservacao()))
                .orElse(null);
    }

    public ServicoDTO criarServico(ServicoDTO servicoDTO) {
        Servico servico = new Servico();

        // 🔹 Geração automática do código da OS
        String ano = String.valueOf(java.time.Year.now().getValue());
        long sequencia = servicoRepository.count() + 1;
        String codigoGerado = String.format("OS-%s-%04d", ano, sequencia);

        // 🔸 Garantir unicidade (caso deseje segurança extra, pode usar UUID ou incrementar com repositório)
        while (servicoRepository.findByCodigoOS(codigoGerado) != null) {
            sequencia++;
            codigoGerado = String.format("OS-%s-%04d", ano, sequencia);
        }

        servico.setCodigoOS(codigoGerado);
        servico.setCliente(servicoDTO.getCliente());
        servico.setCpfOuCnpj(servicoDTO.getCpfOuCnpj());
        servico.setEndereco(servicoDTO.getEndereco());
        servico.setSolicitacao(servicoDTO.getSolicitacao());
        servico.setDataCriacao(servicoDTO.getDataCriacao());
        servico.setQuantidade(servicoDTO.getQuantidade());
        servico.setStatus(servicoDTO.getStatus());
        servico.setTecnicoResponsavel(servicoDTO.getTecnicoResponsavel());
        servico.setDataExecucaoPrevista(servicoDTO.getDataExecucaoPrevista());
        servico.setDataExecucaoRealizada(servicoDTO.getDataExecucaoRealizada());
        servico.setValor(servicoDTO.getValor());
        servico.setObservacao(servicoDTO.getObservacao());

        Servico salvo = servicoRepository.save(servico);

        return new ServicoDTO(
                salvo.getId(), salvo.getCodigoOS(), salvo.getCliente(), salvo.getCpfOuCnpj(), salvo.getEndereco(),
                salvo.getSolicitacao(), salvo.getDataCriacao(), salvo.getQuantidade(), salvo.getStatus(),
                salvo.getTecnicoResponsavel(), salvo.getDataExecucaoPrevista(), salvo.getDataExecucaoRealizada(),
                salvo.getValor(), salvo.getObservacao()
        );
    }

    public ServicoDTO atualizarServico(Long id, ServicoDTO servicoDTO) {
        Optional<Servico> optionalServico = servicoRepository.findById(id);
        if (optionalServico.isPresent()) {
            Servico servico = optionalServico.get();

            // ⚠️ Não alteramos o códigoOS após criado
            servico.setCliente(servicoDTO.getCliente());
            servico.setCpfOuCnpj(servicoDTO.getCpfOuCnpj());
            servico.setEndereco(servicoDTO.getEndereco());
            servico.setSolicitacao(servicoDTO.getSolicitacao());
            servico.setDataCriacao(servicoDTO.getDataCriacao());
            servico.setQuantidade(servicoDTO.getQuantidade());
            servico.setStatus(servicoDTO.getStatus());
            servico.setTecnicoResponsavel(servicoDTO.getTecnicoResponsavel());
            servico.setDataExecucaoPrevista(servicoDTO.getDataExecucaoPrevista());
            servico.setDataExecucaoRealizada(servicoDTO.getDataExecucaoRealizada());
            servico.setValor(servicoDTO.getValor());
            servico.setObservacao(servicoDTO.getObservacao());

            Servico atualizado = servicoRepository.save(servico);

            return new ServicoDTO(
                    atualizado.getId(), atualizado.getCodigoOS(), atualizado.getCliente(), atualizado.getCpfOuCnpj(),
                    atualizado.getEndereco(), atualizado.getSolicitacao(), atualizado.getDataCriacao(), atualizado.getQuantidade(),
                    atualizado.getStatus(), atualizado.getTecnicoResponsavel(), atualizado.getDataExecucaoPrevista(),
                    atualizado.getDataExecucaoRealizada(), atualizado.getValor(), atualizado.getObservacao()
            );
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

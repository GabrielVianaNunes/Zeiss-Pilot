package com.zeiss.pilot.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zeiss.pilot.dto.DocumentoPDFDTO;
import com.zeiss.pilot.entity.DocumentoPDF;
import com.zeiss.pilot.entity.Usuario;
import com.zeiss.pilot.repository.DocumentoPDFRepository;

@Service
public class DocumentoPDFService {

    @Autowired
    private DocumentoPDFRepository documentoRepository;

    private final String PASTA_BASE = "C:/PDFs"; // ajuste conforme necessário

    public DocumentoPDFDTO salvarArquivo(MultipartFile file, LocalDate dataExpiracao, Usuario usuario) throws IOException {
        Long usuarioId = usuario.getId();
    
        // Cria diretório do usuário
        String pastaUsuario = PASTA_BASE + "/Usuario" + usuarioId;
        Files.createDirectories(Paths.get(pastaUsuario));
    
        String nomeArquivo = file.getOriginalFilename();
        String caminhoFinal = pastaUsuario + "/" + nomeArquivo;
    
        Path caminho = Paths.get(caminhoFinal);
        Files.copy(file.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);
    
        DocumentoPDF doc = new DocumentoPDF();
        doc.setNomeArquivo(nomeArquivo);
        doc.setCaminhoArquivo(caminhoFinal);
        doc.setDataExpiracao(dataExpiracao);
        doc.setDataUpload(LocalDateTime.now());
        doc.setStatus("ativo");
        doc.setUsuario(usuario); // direto
    
        DocumentoPDF salvo = documentoRepository.save(doc);
        return toDTO(salvo);
    }
    

    public List<DocumentoPDFDTO> listarPorUsuario(Long usuarioId) {
        return documentoRepository.findByUsuarioId(usuarioId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void remover(Long id) {
        documentoRepository.findById(id).ifPresent(doc -> {
            try {
                Files.deleteIfExists(Paths.get(doc.getCaminhoArquivo()));
            } catch (IOException e) {
                e.printStackTrace(); // ou log
            }
            documentoRepository.deleteById(id);
        });
    }

    public DocumentoPDFDTO editarDataExpiracao(Long id, LocalDate novaData) {
        Optional<DocumentoPDF> opt = documentoRepository.findById(id);
        if (opt.isPresent()) {
            DocumentoPDF doc = opt.get();
            doc.setDataExpiracao(novaData);
    
            // Recalcular o status com base na nova data
            doc.setStatus(calcularStatus(novaData));
    
            return toDTO(documentoRepository.save(doc));
        }
        return null;
    }
    
    private String calcularStatus(LocalDate dataExpiracao) {
        LocalDate hoje = LocalDate.now();
        if (dataExpiracao.isBefore(hoje)) {
            return "expirado";
        } else if (!dataExpiracao.isAfter(hoje.plusDays(30))) {
            return "prestes a vencer";
        } else {
            return "ativo";
        }
    }    

    private DocumentoPDFDTO toDTO(DocumentoPDF doc) {
        DocumentoPDFDTO dto = new DocumentoPDFDTO();
        dto.setId(doc.getId());
        dto.setNomeArquivo(doc.getNomeArquivo());
        dto.setCaminhoArquivo(doc.getCaminhoArquivo());
        dto.setDataExpiracao(doc.getDataExpiracao());
        dto.setStatus(doc.getStatus());
        dto.setUsuarioId(doc.getUsuario().getId());
        return dto;
    }
}

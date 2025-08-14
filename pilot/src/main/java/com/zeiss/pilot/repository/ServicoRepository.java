package com.zeiss.pilot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zeiss.pilot.dto.RelatorioMensalDTO;
import com.zeiss.pilot.entity.Servico;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {

    List<Servico> findByStatus(String status);
    Servico findByCodigoOS(String codigoOS);

    @Query("SELECT new com.zeiss.pilot.dto.RelatorioMensalDTO(YEAR(s.dataCriacao), MONTH(s.dataCriacao), SUM(s.valor), COUNT(s)) " +
           "FROM Servico s GROUP BY YEAR(s.dataCriacao), MONTH(s.dataCriacao) ORDER BY YEAR(s.dataCriacao), MONTH(s.dataCriacao)")
    List<RelatorioMensalDTO> calcularArrecadacaoMensal();
}

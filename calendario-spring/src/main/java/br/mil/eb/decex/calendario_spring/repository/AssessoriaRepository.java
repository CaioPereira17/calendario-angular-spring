package br.mil.eb.decex.calendario_spring.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.mil.eb.decex.calendario_spring.modelo.Assessoria;

import java.util.Optional; // <-- Adicione esta importação no topo do arquivo //correção an criação do perfil com assessoria. (calendário spring.)

@Repository
public interface AssessoriaRepository extends JpaRepository<Assessoria, Long> {

    
    // Método para buscar assessorias sem assessoriaPai
    @Query("SELECT a FROM Assessoria a WHERE  a.assessoriaPai IS NULL")
    List<Assessoria> findAssessoriasWithoutAssessoriaPai();

    List<Assessoria> findByAssessoriaPaiId(Long assessoriaPaiId);

    @Query("SELECT a FROM Assessoria a WHERE LOWER (a.sigla) LIKE LOWER(CONCAT('%', :termo, '%')) ")    
    Page<Assessoria> findBySigla(String termo, Pageable pageable);

    // ADICIONE ESTA LINHA: tratamento de verificação de assessoria.(calendário spring.)
    Optional<Assessoria> findBySigla(String sigla);

    // List<Assessoria> findAssessoriasWithoutAssessoriaSigla(String sigla, Pageable pageable);
}

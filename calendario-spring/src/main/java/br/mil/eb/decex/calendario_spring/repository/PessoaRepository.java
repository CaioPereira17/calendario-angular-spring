package br.mil.eb.decex.calendario_spring.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.mil.eb.decex.calendario_spring.modelo.Pessoa;
import java.util.List;
import java.util.Optional;

@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

    // ... existing auxiliary methods ...

    /* === 1. BUSCA DA TABELA (Paginada) === */
    @Query("SELECT p FROM Pessoa p " +
            "LEFT JOIN p.assessoria a " +
            "LEFT JOIN a.assessoriaPai pai " +
            "WHERE p.liberado = true " +

            // 1. Filtro de NOME (apenas nome ou nome de guerra)
            "AND (:termo IS NULL OR :termo = '' OR " +
            "     LOWER(p.nomeGuerra) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "     LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%'))) " +

            // 2. Filtro de ASSESSORIA (Exata no Pai ou Filha)
            "AND (:assessoria IS NULL OR :assessoria = '' OR " +
            "     a.sigla = :assessoria OR " +
            "     pai.sigla = :assessoria) " +

            // 3. Filtro de MÊS
            "AND (:mesNascimento IS NULL OR EXTRACT(MONTH FROM p.dtNascimento) = :mesNascimento) " +

            "ORDER BY p.postoGraduacaoOrdinal")
    Page<Pessoa> buscarPorNomeOuAssessoriaEMes(
            @Param("termo") String termo,
            @Param("assessoria") String assessoria,
            @Param("mesNascimento") Integer mesNascimento,
            Pageable pageable
    );

    /* === 2. BUSCA DO RELATÓRIO PDF (Lista Completa) === */
    @Query("SELECT p FROM Pessoa p " +
            "LEFT JOIN p.assessoria a " +
            "LEFT JOIN a.assessoriaPai pai " +
            "WHERE p.liberado = true " +
            "AND (:termo IS NULL OR :termo = '' OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(p.nomeGuerra) LIKE LOWER(CONCAT('%', :termo, '%'))) " +
            "AND (:mes IS NULL OR EXTRACT(MONTH FROM p.dtNascimento) = :mes) " +
            "AND (:assessoria IS NULL OR :assessoria = '' OR a.sigla = :assessoria OR pai.sigla = :assessoria) " +
            "ORDER BY p.postoGraduacaoOrdinal ASC, p.nomeGuerra ASC")
    List<Pessoa> findForRelatorio(
            @Param("termo") String termo,
            @Param("mes") Integer mes,
            @Param("assessoria") String assessoria
    );

    // ... existing methods (findInativas, findByIdentidade) ...
    @Query("SELECT p FROM Pessoa p WHERE p.liberado = false")
    Page<Pessoa> findInativas(Pageable pageable);

    Optional<Pessoa> findByIdentidade(String idt);
}
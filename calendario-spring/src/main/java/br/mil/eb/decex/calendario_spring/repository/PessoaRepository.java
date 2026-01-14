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

    /* MÉTODO ANTIGO (Pode manter se quiser, mas o novo abaixo já faz o trabalho deste
       se passar o mês como null)
    */
    @Query("SELECT p FROM Pessoa p " +
            "WHERE p.liberado = true " +
            "AND (" +
            "LOWER(p.nomeGuerra) LIKE LOWER(CONCAT('%', :termo, '%')) " +
            "OR LOWER(p.assessoria.sigla) LIKE LOWER(CONCAT('%', :termo, '%')) " +
            ") " +
            "ORDER BY p.postoGraduacaoOrdinal")
    Page<Pessoa> findByNomeGuerraOrAssessoriaAndLiberadoTrue(@Param("termo") String termo, Pageable pageable);


    /* === NOVO MÉTODO COMPLETO (Texto + Mês) ===
       Lógica:
       1. Filtra liberado = true
       2. Filtra Texto (Nome ou Sigla)
       3. Filtra Mês:
          - Se :mesNascimento for NULO (usuário selecionou "Todos"), ignora o filtro de data.
          - Se tiver valor, compara com o mês da data de nascimento usando EXTRACT(MONTH...)
    */
    @Query("SELECT p FROM Pessoa p WHERE " +
            "p.liberado = true AND " +
            "(" +
            "LOWER(p.nomeGuerra) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(p.assessoria.sigla) LIKE LOWER(CONCAT('%', :termo, '%'))" +
            ") AND " +
            "(:mesNascimento IS NULL OR EXTRACT(MONTH FROM p.dtNascimento) = :mesNascimento) " +
            "ORDER BY p.postoGraduacaoOrdinal")
    Page<Pessoa> buscarPorNomeOuAssessoriaEMes(
            @Param("termo") String termo,
            @Param("mesNascimento") Integer mesNascimento,
            Pageable pageable
    );
    //Buscar todos para relatório (ajuste conforme sua query atual de listagem)
    @Query("SELECT p FROM Pessoa p " +
            "WHERE (:termo IS NULL OR :termo = '' OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(p.nomeGuerra) LIKE LOWER(CONCAT('%', :termo, '%'))) " +
            "AND (:mes IS NULL OR MONTH(p.dtNascimento) = :mes) " +

            // --- CORREÇÃO AQUI ---
            // Mudamos de '=' para 'LIKE ... %'
            // Assim, se filtrar "DTI", ele pega "DTI", "DTI-REDES", "DTI-MNT", etc.
            "AND (:assessoria IS NULL OR :assessoria = '' OR p.assessoria.sigla LIKE CONCAT(:assessoria, '%')) " +

            "ORDER BY p.postoGraduacaoOrdinal ASC, p.nomeGuerra ASC")
    List<Pessoa> findForRelatorio(
            @Param("termo") String termo,
            @Param("mes") Integer mes,
            @Param("assessoria") String assessoria
    );


    // Métodos auxiliares existentes
    Page<Pessoa> findByNomeGuerraContainingIgnoreCaseOrAssessoria_SiglaContainingIgnoreCase(String nomeGuerra, String sigla, Pageable pageable);

    @Query("SELECT p FROM Pessoa p WHERE p.liberado = false")
    Page<Pessoa> findInativas(Pageable pageable);

    Optional<Pessoa> findByIdentidade(String idt);
}
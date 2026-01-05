package br.mil.eb.decex.calendario_spring.repository;

import br.mil.eb.decex.calendario_spring.modelo.Pessoa;
import br.mil.eb.decex.calendario_spring.modelo.PessoaTIInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PessoaTIInfoRepository extends JpaRepository<PessoaTIInfo, Long> {
    @Query("SELECT p FROM PessoaTIInfo p WHERE p.pessoa.id = :pessoaId")
PessoaTIInfo findByPessoaId(@Param("pessoaId") Long pessoaId);

    boolean existsByPessoa(Pessoa pessoa);


}

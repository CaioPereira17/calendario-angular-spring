package br.mil.eb.decex.calendario_spring.dto.mapper;

import org.springframework.stereotype.Component;
import br.mil.eb.decex.calendario_spring.dto.PessoaDTO;
import br.mil.eb.decex.calendario_spring.modelo.Pessoa;

@Component
public class PessoaMapper {

    public PessoaDTO toDTO(Pessoa pessoa) {
        if (pessoa == null) {
            return null;
        }

        return new PessoaDTO(
                pessoa.getId(),
                pessoa.getIdentidade(),
                pessoa.getUsers(),
                pessoa.getNome(),
                pessoa.getNomeGuerra(),
                pessoa.getPostoGraduacao(),
                pessoa.getArmaquadroservico(),
                pessoa.getAssessoria(),
                pessoa.getLiberado(),
                pessoa.getTipoAcesso(),
                pessoa.getRamal(),
                pessoa.getDtPraca(), // Já estava aqui (Correto)
                pessoa.getCaminho(),
                pessoa.getDataUltimaPromocao()
        );
    }

    public Pessoa toEntity(PessoaDTO pessoaDTO) {
        if (pessoaDTO == null) {
            return null;
        }

        Pessoa pessoa = new Pessoa();

        if (pessoaDTO.id() != null) {
            pessoa.setId(pessoaDTO.id());
        }

        pessoa.setIdentidade(pessoaDTO.identidade());
        pessoa.setUsers(pessoaDTO.users());
        pessoa.setNome(pessoaDTO.nome());
        pessoa.setNomeGuerra(pessoaDTO.nomeGuerra());
        pessoa.setPostoGraduacao(pessoaDTO.postoGraduacao());
        pessoa.setArmaquadroservico(pessoaDTO.armaquadroservico());

        // --- CORREÇÃO: Faltava esta linha para salvar no banco ---
        pessoa.setDtPraca(pessoaDTO.dtPraca());
        // --------------------------------------------------------

        pessoa.setAssessoria(pessoaDTO.assessoria());
        pessoa.setLiberado(pessoaDTO.liberado());
        pessoa.setTipoAcesso(pessoaDTO.tipoAcesso());
        pessoa.setRamal(pessoaDTO.ramal());

        // Mantive sua lógica original de caminho
        pessoa.setCaminho("http://localhost:8080/media/" + pessoaDTO.identidade() + ".jpg");

        pessoa.setDataUltimaPromocao(pessoaDTO.dataUltimaPromocao());

        return pessoa;
    }
}

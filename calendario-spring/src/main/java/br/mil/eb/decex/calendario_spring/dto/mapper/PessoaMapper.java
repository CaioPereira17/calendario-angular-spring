//package br.mil.eb.decex.calendario_spring.dto.mapper;
//
//import org.springframework.stereotype.Component;
//import br.mil.eb.decex.calendario_spring.dto.PessoaDTO;
//import br.mil.eb.decex.calendario_spring.modelo.Pessoa;
//
//@Component
//public class PessoaMapper {
//
//    public PessoaDTO toDTO(Pessoa pessoa) {
//        if (pessoa == null) {
//            return null;
//        }
//
//        // A ordem aqui DEVE ser EXATAMENTE a mesma do seu arquivo PessoaDTO.java
//        return new PessoaDTO(
//                pessoa.getId(),
//                pessoa.getIdentidade(),
//                pessoa.getUsers(),
//                pessoa.getNome(),
//                pessoa.getNomeGuerra(),
//                pessoa.getPostoGraduacao(),
//                pessoa.getArmaquadroservico(),
//                pessoa.getAssessoria(),
//                pessoa.getLiberado(),
//                pessoa.getTipoAcesso(),
//                pessoa.getRamal(),
//
//                pessoa.getDtPraca(),       // Já existia
//                pessoa.getDtNascimento(),  // <--- ADICIONE ESTA LINHA (O erro sumirá aqui)
//
//                pessoa.getCaminho(),
//                pessoa.getDataUltimaPromocao()
//        );
//    }
//
//    public Pessoa toEntity(PessoaDTO pessoaDTO) {
//        if (pessoaDTO == null) {
//            return null;
//        }
//
//        Pessoa pessoa = new Pessoa();
//
//        if (pessoaDTO.id() != null) {
//            pessoa.setId(pessoaDTO.id());
//        }
//
//        pessoa.setIdentidade(pessoaDTO.identidade());
//        pessoa.setUsers(pessoaDTO.users());
//        pessoa.setNome(pessoaDTO.nome());
//        pessoa.setNomeGuerra(pessoaDTO.nomeGuerra());
//        pessoa.setPostoGraduacao(pessoaDTO.postoGraduacao());
//        pessoa.setArmaquadroservico(pessoaDTO.armaquadroservico());
//
//        // Datas
//        pessoa.setDtPraca(pessoaDTO.dtPraca());
//        pessoa.setDtNascimento(pessoaDTO.dtNascimento()); // <--- ADICIONE ESTA LINHA (Para salvar no banco)
//        pessoa.setDataUltimaPromocao(pessoaDTO.dataUltimaPromocao());
//
//        pessoa.setAssessoria(pessoaDTO.assessoria());
//        pessoa.setLiberado(pessoaDTO.liberado());
//        pessoa.setTipoAcesso(pessoaDTO.tipoAcesso());
//        pessoa.setRamal(pessoaDTO.ramal());
//
//        // Lógica de caminho da imagem (mantida original)
//        pessoa.setCaminho("http://localhost:8080/media/" + pessoaDTO.identidade() + ".jpg");
//
//        return pessoa;
//    }
//}
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

        // A ordem aqui DEVE ser EXATAMENTE a mesma do seu arquivo PessoaDTO.java
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

                pessoa.getDtPraca(),       // Já existia
                pessoa.getDtNascimento(),  // <--- ADICIONE ESTA LINHA (O erro sumirá aqui)

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

        // Datas
        pessoa.setDtPraca(pessoaDTO.dtPraca());
        pessoa.setDtNascimento(pessoaDTO.dtNascimento());
        pessoa.setDataUltimaPromocao(pessoaDTO.dataUltimaPromocao());

        pessoa.setAssessoria(pessoaDTO.assessoria());
        pessoa.setLiberado(pessoaDTO.liberado());
        pessoa.setTipoAcesso(pessoaDTO.tipoAcesso());
        pessoa.setRamal(pessoaDTO.ramal());

        // --- CORREÇÃO DA LÓGICA DA FOTO ---
        // 1. Se o Front enviou um caminho válido (ex: upload novo), usa ele.
        if (pessoaDTO.caminho() != null && !pessoaDTO.caminho().isEmpty()) {
            pessoa.setCaminho(pessoaDTO.caminho());
        }
        // 2. Se não enviou caminho mas tem identidade (legado/importação), gera o padrão.
        else if (pessoaDTO.identidade() != null && !pessoaDTO.identidade().isEmpty()) {
            pessoa.setCaminho("http://localhost:8080/media/" + pessoaDTO.identidade() + ".jpg");
        }
        // 3. Se não tem nada, define o padrão "sem foto".
        else {
            pessoa.setCaminho("http://localhost:8080/media/branco.jpg");
        }

        return pessoa;
    }
}
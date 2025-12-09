package br.mil.eb.decex.calendario_spring;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import br.mil.eb.decex.calendario_spring.enumerado.PostoGraduacao;
import br.mil.eb.decex.calendario_spring.enumerado.TipoAcesso;
import br.mil.eb.decex.calendario_spring.modelo.Assessoria;
import br.mil.eb.decex.calendario_spring.modelo.Pessoa;
import br.mil.eb.decex.calendario_spring.modelo.PessoaTIInfo;
import br.mil.eb.decex.calendario_spring.modelo.Usuario;
import br.mil.eb.decex.calendario_spring.repository.AssessoriaRepository;
import br.mil.eb.decex.calendario_spring.repository.PessoaRepository;
import br.mil.eb.decex.calendario_spring.repository.PessoaTIInfoRepository;
import br.mil.eb.decex.calendario_spring.repository.UsuarioRepository;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@SpringBootApplication
public class CalendarioSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(CalendarioSpringApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(
            PessoaRepository pessoaRepository,
            AssessoriaRepository assessoriaRepository,
            UsuarioRepository usuarioRepository,
            PessoaTIInfoRepository pessoaTIInfoRepository) {

        return args -> {
            // Exemplo de verificação antes de criar assessoria

            //Criação das Assessorias
//            Assessoria assessoria = new Assessoria();
//            assessoria.setDescricao("Divisão de Tecnologia da Informação");
//            assessoria.setSigla("DTI");
//            assessoriaRepository.save(assessoria);

            // --- CORREÇÃO PASSO 1 ---
            // Primeiro, verifique se a Assessoria "DTI" existe.
            // Se não existir, crie-a.
            Assessoria assessoriaDTI = assessoriaRepository.findBySigla("DTI")
                    .orElseGet(() -> {
                        Assessoria novaAssessoria = new Assessoria();
                        novaAssessoria.setDescricao("Divisão de Tecnologia da Informação");
                        novaAssessoria.setSigla("DTI");
                        return assessoriaRepository.save(novaAssessoria);
                    });

            // Exemplo de verificação antes de criar Pessoa
            Pessoa pessoa = pessoaRepository.findByIdentidade("019562303-8")
                    .orElseGet(() -> {
                        Pessoa novaPessoa = new Pessoa();
                        novaPessoa.setIdentidade("019562303-8");
                        novaPessoa.setNome("Vanilton Gomes dos Santos");
                        novaPessoa.setNomeGuerra("Vanilton");
                        novaPessoa.setTipoAcesso(TipoAcesso.ADMINISTRADOR);
                        novaPessoa.setPostoGraduacao(PostoGraduacao.SEG_SARGENTO);
                        novaPessoa.setArmaquadroservico("Comunicações");
                        novaPessoa.setLiberado(true);

                        DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                        novaPessoa.setDataUltimaPromocao(LocalDate.parse("25/11/2025", formato));

                        // --- CORREÇÃO AQUI: Adicione a Data de Nascimento e Data de Praça ---
                        // Como são campos @NotNull, você é obrigado a preencher aqui também.
                        novaPessoa.setDtNascimento(LocalDate.parse("01/01/1980", formato));
                        novaPessoa.setDtPraca(LocalDate.parse("01/03/1999", formato));
                        // -------------------------------------------------------------------

                        novaPessoa.setAssessoria(assessoriaDTI);
                        novaPessoa.setRamal("8105678");
                        novaPessoa.setCaminho("http://localhost:8080/media/0195623038.jpg");

                        return pessoaRepository.save(novaPessoa);
                    });

            // Criar informações de TI apenas se não existirem
            if (!pessoaTIInfoRepository.existsByPessoa(pessoa)) {
                PessoaTIInfo tiInfo = new PessoaTIInfo();
                tiInfo.setPessoa(pessoa);
                tiInfo.setControleAcessoId("12345");
                tiInfo.setContaAd("user.ad");
                tiInfo.setContaSiscau("siscau-user");
                tiInfo.setContaSped("sped-user");
                pessoaTIInfoRepository.save(tiInfo);
            }

            // Verificação antes de criar Usuario
            usuarioRepository.findByUsername("0195623038")
                    .orElseGet(() -> {
                        Usuario usuario = new Usuario();
                        usuario.setUsername("0195623038");
                        usuario.setPassword("$2a$12$GkgWGrA1LQ27BPo235vAJ.CfFAHt4uUATsX7xQG.mDVjj3gI02NUm");
                        usuario.setRole("ADMINISTRADOR");
                        usuario.setLiberado(true);
                        return usuarioRepository.save(usuario);
                    });
        };
    }

}

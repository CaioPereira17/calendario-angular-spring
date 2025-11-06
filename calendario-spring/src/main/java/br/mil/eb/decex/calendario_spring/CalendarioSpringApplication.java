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
		PessoaTIInfoRepository pessoaTIInfoRepository) {  // Adicionando PessoaTIInfoRepository
		
		return args -> {
			//pessoaRepository.deleteAll();  // Limpa a tabela `pessoa`
			//pessoaTIInfoRepository.deleteAll(); // Limpa a tabela `pessoa_ti_info` (evita duplicações)

			// Criação das Assessorias
			Assessoria assessoria = new Assessoria();
			assessoria.setDescricao("Divisão de Tecnologia da Informação");
			assessoria.setSigla("DTI");
			assessoriaRepository.save(assessoria);

			// Criação de Pessoas
			Pessoa pessoa = new Pessoa();
			pessoa.setIdentidade("019.562.303-8");
			pessoa.setNome("Vanilton Gomes dos Santos");
			pessoa.setNomeGuerra("Vanilton");
			pessoa.setTipoAcesso(TipoAcesso.ADMINISTRADOR);
			pessoa.setPostoGraduacao(PostoGraduacao.SEG_SARGENTO);
			pessoa.setLiberado(true);
			pessoa.setAntiguidade("1");
			pessoa.setAssessoria(assessoria);
			pessoa.setRamal("810 - 5678");
			pessoa.setCaminho("http://localhost:8080/media/0195623038.jpg");

			// Salva a pessoa no banco
			Pessoa pessoaSalva = pessoaRepository.save(pessoa);

			// Criar informações de TI para essa pessoa
			PessoaTIInfo tiInfo = new PessoaTIInfo();
			tiInfo.setPessoa(pessoaSalva);
			tiInfo.setControleAcessoId("12345");
			tiInfo.setContaAd("user.ad");
			tiInfo.setContaSiscau("siscau-user");
			tiInfo.setContaSped("sped-user");

			// Salva as informações de TI no banco
			pessoaTIInfoRepository.save(tiInfo);

			// Criação de Usuário
			Usuario usuario = new Usuario();
			usuario.setUsername("0195623038");
			usuario.setPassword("$2a$12$GkgWGrA1LQ27BPo235vAJ.CfFAHt4uUATsX7xQG.mDVjj3gI02NUm");
			usuario.setRole("ADMINISTRADOR");
			usuario.setLiberado(true);
			usuarioRepository.save(usuario);
		};
	}
}

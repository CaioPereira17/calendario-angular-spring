package br.mil.eb.decex.calendario_spring.service;

import br.mil.eb.decex.calendario_spring.dto.PessoaDTO;
import br.mil.eb.decex.calendario_spring.dto.PessoaPageDTO;
import br.mil.eb.decex.calendario_spring.dto.mapper.PessoaMapper;
import br.mil.eb.decex.calendario_spring.exception.RecordNotFoundException;
import br.mil.eb.decex.calendario_spring.modelo.Pessoa;
import br.mil.eb.decex.calendario_spring.modelo.PessoaTIInfo;
import br.mil.eb.decex.calendario_spring.repository.PessoaRepository;
import br.mil.eb.decex.calendario_spring.repository.PessoaTIInfoRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Validated
@Service
public class PessoaService {


    private final PessoaRepository pessoaRepository;
    private final PessoaMapper pessoaMapper;

    @Autowired
    private PessoaTIInfoRepository pessoaTIInfoRepository;

    public PessoaService(PessoaRepository pessoaRepository, PessoaMapper pessoaMapper) {
        this.pessoaRepository = pessoaRepository;
        this.pessoaMapper = pessoaMapper;
    }

    public Pessoa salvarPessoaComTIInfo(Pessoa pessoa, PessoaTIInfo tiInfo) {
        pessoa = pessoaRepository.save(pessoa);

        if (tiInfo != null) {
            tiInfo.setPessoa(pessoa);
            pessoaTIInfoRepository.save(tiInfo);
        }
        return pessoa;
    }

    public PessoaTIInfo atualizarTIInfo(Long pessoaId, PessoaTIInfo novasInfos) {
        Pessoa pessoa = pessoaRepository.findById(pessoaId)
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));

        PessoaTIInfo tiInfo = pessoaTIInfoRepository.findByPessoaId(pessoaId);

        if (tiInfo == null) {
            tiInfo = new PessoaTIInfo();
            tiInfo.setPessoa(pessoa);
        }

        tiInfo.setControleAcessoId(novasInfos.getControleAcessoId());
        tiInfo.setContaAd(novasInfos.getContaAd());
        tiInfo.setContaSiscau(novasInfos.getContaSiscau());
        tiInfo.setContaSped(novasInfos.getContaSped());

        return pessoaTIInfoRepository.save(tiInfo);
    }

    public PessoaPageDTO listarInativas(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        Page<Pessoa> pagePessoa = pessoaRepository.findInativas(pageable);

        List<PessoaDTO> pessoasDTO = pagePessoa.stream()
                .map(pessoaMapper::toDTO)
                .collect(Collectors.toList());

        return new PessoaPageDTO(pessoasDTO, pagePessoa.getTotalElements(), pagePessoa.getTotalPages());
    }

    private String verificarCaminhoImagem(String caminho) {
        String basePath = "images/";
        if (caminho == null || caminho.isEmpty()) {
            return "http://localhost:8080/media/branco.jpg";
        }
        String nomeArquivo = caminho.substring(caminho.lastIndexOf("/") + 1);
        Path caminhoImagem = Paths.get(basePath + nomeArquivo);

        if (Files.exists(caminhoImagem)) {
            return caminho;
        } else {
            return "http://localhost:8080/media/branco.jpg";
        }
    }

    public List<PessoaDTO> list() {
        return pessoaRepository.findAll().stream().map(pessoaMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Responsável por organizar a hieraquia e aniversariantes do mês
    public PessoaPageDTO search(String termo, @PositiveOrZero int page, @Positive @Max(100) int pageSize, Integer mesNascimento) {

        // ORDENAÇÃO DE ANTIGUIDADE MILITAR COMPLETA:
        Sort sort = Sort.by(
                Sort.Order.asc("postoGraduacaoOrdinal"), // 1. Hierarquia
                Sort.Order.asc("dataUltimaPromocao"),    // 2. Antiguidade no posto
                Sort.Order.asc("dtPraca"),               // 3. Tempo de serviço
                Sort.Order.asc("dtNascimento"),          // 4. Idade
                Sort.Order.asc("nome")                   // 5. Ordem Alfabética
        );

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        // Chama o método novo do repositório que sabe filtrar por Mês + Texto
        Page<Pessoa> pagePessoa = pessoaRepository.buscarPorNomeOuAssessoriaEMes(termo, mesNascimento, pageable);

        List<PessoaDTO> pessoas = pagePessoa.get().map(pessoa -> {
            PessoaDTO pessoaDTO = pessoaMapper.toDTO(pessoa);
            String caminhoAtualizado = verificarCaminhoImagem(pessoaDTO.caminho());

            return new PessoaDTO(
                    pessoaDTO.id(),
                    pessoaDTO.identidade(),
                    pessoaDTO.users(),
                    pessoaDTO.nome(),
                    pessoaDTO.nomeGuerra(),
                    pessoaDTO.postoGraduacao(),
                    pessoaDTO.armaquadroservico(),
                    pessoaDTO.assessoria(),
                    pessoaDTO.liberado(),
                    pessoaDTO.tipoAcesso(),
                    pessoaDTO.ramal(),
                    pessoaDTO.dtPraca(),
                    pessoaDTO.dtNascimento(),
                    caminhoAtualizado,
                    pessoaDTO.dataUltimaPromocao()
            );
        }).collect(Collectors.toList());

        return new PessoaPageDTO(pessoas, pagePessoa.getTotalElements(), pagePessoa.getTotalPages());
    }

    public PessoaDTO findById(@NotNull @Positive Long id) {
        return pessoaRepository.findById(id).map(pessoaMapper::toDTO)
                .orElseThrow(() -> new RecordNotFoundException(id));
    }

    public PessoaDTO create(@Valid @NotNull PessoaDTO pessoa) {
        return pessoaMapper.toDTO(pessoaRepository.save(pessoaMapper.toEntity(pessoa)));
    }

    public PessoaDTO update(@NotNull @Positive Long id, @Valid PessoaDTO pessoa) {
        return pessoaRepository.findById(id)
                .map(recordFound -> {
                    recordFound.setNome(pessoa.nome());
                    recordFound.setNomeGuerra(pessoa.nomeGuerra());
                    recordFound.setPostoGraduacao(pessoa.postoGraduacao());
                    recordFound.setDataUltimaPromocao(pessoa.dataUltimaPromocao());
                    recordFound.setDtPraca(pessoa.dtPraca());
                    recordFound.setDtNascimento(pessoa.dtNascimento());
                    recordFound.setAssessoria(pessoa.assessoria());
                    recordFound.setCaminho(pessoa.caminho());
                    recordFound.setLiberado(pessoa.liberado());
                    recordFound.setRamal(pessoa.ramal());
                    recordFound.setTipoAcesso(pessoa.tipoAcesso());
                    recordFound.setArmaquadroservico(pessoa.armaquadroservico());

                    return pessoaMapper.toDTO(pessoaRepository.save(recordFound));
                }).orElseThrow(() -> new RecordNotFoundException(id));
    }

    public void delete(@NotNull @Positive Long id) {
        pessoaRepository.delete(pessoaRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id)));
    }
}
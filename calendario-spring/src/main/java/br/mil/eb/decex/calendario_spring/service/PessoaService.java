package br.mil.eb.decex.calendario_spring.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

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

@Validated
@Service
public class PessoaService {

    private static final Logger logger = LoggerFactory.getLogger(PessoaService.class);
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

    public Page<Pessoa> searchByNomeGuerraOrAssessoria(String termo, Pageable pageable) {
        return pessoaRepository.findByNomeGuerraOrAssessoriaAndLiberadoTrue(termo, pageable);
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

    // Responsável por organizar dentro da antiguidade: POSTO > PROMOÇÃO > DATA PRAÇA // CB CAIO TEN GUTIERRE E RAMOS
    public PessoaPageDTO search(String termo, @PositiveOrZero int page, @Positive @Max(100) int pageSize) {

        // ORDENAÇÃO DE ANTIGUIDADE MILITAR:
        Sort sort = Sort.by(
                Sort.Order.asc("postoGraduacaoOrdinal"), // 1. Hierarquia (General > Cel > Ten)
                Sort.Order.asc("dataUltimaPromocao"),    // 2. Antiguidade no posto (Data menor = mais antigo)
                Sort.Order.asc("dtPraca")                // 3. Desempate: Tempo de serviço (Data menor = mais antigo)
        );

        Page<Pessoa> pagePessoa = pessoaRepository.findByNomeGuerraOrAssessoriaAndLiberadoTrue(termo,
                PageRequest.of(page, pageSize, sort));

        List<PessoaDTO> pessoas = pagePessoa.get().map(pessoa -> {
            PessoaDTO pessoaDTO = pessoaMapper.toDTO(pessoa);
            String caminhoAtualizado = verificarCaminhoImagem(pessoaDTO.caminho());

            // ATENÇÃO: Certifique-se de que a ordem aqui bate com o seu PessoaDTO.java
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
                    pessoaDTO.dtPraca(), // Campo Novo (Data de Praça)
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
                    // Atualiza apenas os campos necessários
                    recordFound.setNome(pessoa.nome());
                    recordFound.setNomeGuerra(pessoa.nomeGuerra());
                    recordFound.setPostoGraduacao(pessoa.postoGraduacao());
                    recordFound.setDataUltimaPromocao(pessoa.dataUltimaPromocao());
                    recordFound.setDtPraca(pessoa.dtPraca()); // Atualiza a Data de Praça no Banco
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
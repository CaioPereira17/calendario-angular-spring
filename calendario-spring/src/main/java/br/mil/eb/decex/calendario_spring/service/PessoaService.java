package br.mil.eb.decex.calendario_spring.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort; // (Você já deve ter)


@Validated
@Service
public class PessoaService {
    // ADICIONE ESTA LINHA:
    private static final Logger logger = LoggerFactory.getLogger(PessoaService.class);
    private final PessoaRepository pessoaRepository;
    private final PessoaMapper pessoaMapper;

    @Autowired
    private PessoaTIInfoRepository pessoaTIInfoRepository;

    public Pessoa salvarPessoaComTIInfo(Pessoa pessoa, PessoaTIInfo tiInfo) {
        pessoa = pessoaRepository.save(pessoa);

        if (tiInfo != null) {
            tiInfo.setPessoa(pessoa);
            pessoaTIInfoRepository.save(tiInfo);
        }

        return pessoa;
    }

    public PessoaTIInfo atualizarTIInfo(Long pessoaId, PessoaTIInfo novasInfos) {
        // Busca a pessoa existente SEM criar uma nova
        Pessoa pessoa = pessoaRepository.findById(pessoaId)
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));

        // Busca informações de TI, se existirem
        PessoaTIInfo tiInfo = pessoaTIInfoRepository.findByPessoaId(pessoaId);

        if (tiInfo == null) {
            // Se não existir, cria um novo registro de TI SEM criar nova pessoa
            tiInfo = new PessoaTIInfo();
            tiInfo.setPessoa(pessoa);
        }

        // Atualiza os dados da tabela pessoa_ti_info
        tiInfo.setControleAcessoId(novasInfos.getControleAcessoId());
        tiInfo.setContaAd(novasInfos.getContaAd());
        tiInfo.setContaSiscau(novasInfos.getContaSiscau());
        tiInfo.setContaSped(novasInfos.getContaSped());

        return pessoaTIInfoRepository.save(tiInfo); // Apenas salva as informações de TI
    }

    public PessoaService(PessoaRepository pessoaRepository, PessoaMapper pessoaMapper) {
        this.pessoaRepository = pessoaRepository;
        this.pessoaMapper = pessoaMapper;
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
        // Substitua "D:\\Programação\\2024\\calendario-angular-spring\\calendario-spring\\images\\"
        // pelo caminho absoluto da pasta onde as imagens estão armazenadas
        String basePath = "images/";

        // Extrai o nome do arquivo da URL (assumindo que o caminho é algo como http://localhost:8080/media/0195623038.jpg)
        String nomeArquivo = caminho.substring(caminho.lastIndexOf("/") + 1);

        // Constrói o caminho absoluto do arquivo de imagem
        Path caminhoImagem = Paths.get(basePath + nomeArquivo);

        // Verifica se o arquivo existe no caminho especificado
        if (Files.exists(caminhoImagem)) {
            return caminho; // Retorna o caminho original se o arquivo existir
        } else {
            return "http://localhost:8080/media/branco.jpg"; // Retorna o caminho da imagem padrão se o arquivo não existir
        }
    }

    public List<PessoaDTO> list() {



        return pessoaRepository.findAll().stream().map(pessoaMapper::toDTO)
                .collect(Collectors.toList());

    }

    //caio adição para ordenação asc na dat
    //Responsável pela organização das informações na lista de pessoas = Lista de Ramais 🥷 ASS Cb Caio quase DEV e Ten Ramos Javeiro
    public PessoaPageDTO search(String termo, @PositiveOrZero int page, @Positive @Max(100) int pageSize) {
        Page<Pessoa> pagePessoa = pessoaRepository.findByNomeGuerraOrAssessoriaAndLiberadoTrue(termo, PageRequest.of(page, pageSize, Sort.by(Sort.Direction.ASC, "dataUltimaPromocao")));
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
                    // Atualiza apenas os campos necessários, sem criar uma nova pessoa
                    recordFound.setNome(pessoa.nome());
                    recordFound.setNomeGuerra(pessoa.nomeGuerra());
                    recordFound.setPostoGraduacao(pessoa.postoGraduacao());
                    recordFound.setDataUltimaPromocao(pessoa.dataUltimaPromocao());
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

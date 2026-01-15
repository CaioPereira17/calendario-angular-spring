package br.mil.eb.decex.calendario_spring.controller;

import br.mil.eb.decex.calendario_spring.config.JwtServiceGenerator;
import br.mil.eb.decex.calendario_spring.dto.PessoaDTO;
import br.mil.eb.decex.calendario_spring.dto.PessoaPageDTO;
import br.mil.eb.decex.calendario_spring.dto.mapper.PessoaMapper;
import br.mil.eb.decex.calendario_spring.enumerado.PostoGraduacao;
import br.mil.eb.decex.calendario_spring.modelo.Pessoa;
import br.mil.eb.decex.calendario_spring.modelo.PessoaTIInfo;
import br.mil.eb.decex.calendario_spring.repository.PessoaRepository;
import br.mil.eb.decex.calendario_spring.repository.PessoaTIInfoRepository;
import br.mil.eb.decex.calendario_spring.service.PessoaService;
import br.mil.eb.decex.calendario_spring.service.RelatorioService;
import com.lowagie.text.DocumentException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Validated
@RestController
@RequestMapping("api/pessoas")
public class PessoaController {

    private final PessoaRepository pessoaRepository;
    private final PessoaService pessoaService;
    private final PessoaMapper pessoaMapper;

    @Autowired
    private JwtServiceGenerator jwtServiceGenerator;

    @Autowired
    private PessoaTIInfoRepository pessoaTIInfoRepository;

    @Autowired
    private RelatorioService relatorioService; // Agora sim injetado corretamente

    public PessoaController(PessoaRepository pessoaRepository, PessoaService pessoaService, PessoaMapper pessoaMapper) {
        this.pessoaRepository = pessoaRepository;
        this.pessoaService = pessoaService;
        this.pessoaMapper = pessoaMapper;
    }

    @PutMapping("/reativar/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reativarPessoa(HttpServletRequest request, @PathVariable Long id) {
        jwtServiceGenerator.GetUser(request);
        Pessoa pessoa = pessoaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada"));
        pessoa.setLiberado(true);
        pessoaRepository.save(pessoa);
    }

    @GetMapping
    public List<PessoaDTO> list() {
        return pessoaService.list();
    }

    @GetMapping("/exportar")
    public void exportarPdf(
            @RequestParam(required = false, defaultValue = "") String termo,
            @RequestParam(required = false, defaultValue = "") String assessoria,
            @RequestParam(required = false) Integer mesNascimento,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=lista_ramais_" + System.currentTimeMillis() + ".pdf";
        response.setHeader(headerKey, headerValue);

        List<Pessoa> lista = pessoaService.listarParaRelatorio(termo, assessoria, mesNascimento);

        try {
            relatorioService.gerarRelatorioRamais(lista, response.getOutputStream(), mesNascimento);
        } catch (DocumentException e) {
            throw new IOException("Erro ao gerar PDF", e);
        }
    }

    @GetMapping("/search")
    public PessoaPageDTO search(
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) String assessoria, // <--- New Parameter
            @RequestParam(defaultValue = "0") @PositiveOrZero int page,
            @RequestParam(defaultValue = "10") @Positive @Max(100) int pageSize,
            @RequestParam(required = false) Integer mesNascimento
    ) {
        // Pass assessoria explicitly to the service
        return pessoaService.search(termo, assessoria, page, pageSize, mesNascimento);
    }


    @GetMapping("/inativas")
    public PessoaPageDTO listarPessoasInativas(
            @RequestParam(defaultValue = "0") @PositiveOrZero int page,
            @RequestParam(defaultValue = "10") @Positive @Max(100) int pageSize) {
        return pessoaService.listarInativas(page, pageSize);
    }

    @GetMapping ("/{id}")
    public PessoaDTO findById(@PathVariable @NotNull @Positive Long id){
        return pessoaService.findById(id);
    }

    @GetMapping("/posto-graduacao")
    public ResponseEntity<PostoGraduacao[]> getPostoGraduacaoValues() {
        return ResponseEntity.ok(PostoGraduacao.values());
    }

    @PutMapping("/{id}")
    public PessoaDTO update(@PathVariable @NotNull @Positive Long id,
                            @RequestBody @Valid @NotNull PessoaDTO pessoa) {
        return pessoaService.update(id, pessoa);
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public PessoaDTO create(@RequestBody @Valid PessoaDTO pessoaDTO) {
        Pessoa pessoa = pessoaMapper.toEntity(pessoaDTO);
        Pessoa pessoaSalva = pessoaRepository.saveAndFlush(pessoa);
        return pessoaMapper.toDTO(pessoaSalva);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void delete(@PathVariable @NotNull @Positive Long id) {
        pessoaService.delete(id);
    }

    @GetMapping("/{pessoaId}/ti-info")
    public ResponseEntity<PessoaTIInfo> getPessoaTIInfo(@PathVariable Long pessoaId) {
        PessoaTIInfo tiInfo = pessoaTIInfoRepository.findByPessoaId(pessoaId);
        if (tiInfo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tiInfo);
    }

    @PutMapping("/{pessoaId}/ti-info")
    public ResponseEntity<PessoaTIInfo> updatePessoaTIInfo(@PathVariable Long pessoaId, @RequestBody PessoaTIInfo novasInfos) {
        PessoaTIInfo tiInfoAtualizada = pessoaService.atualizarTIInfo(pessoaId, novasInfos);
        return ResponseEntity.ok(tiInfoAtualizada);
    }
}
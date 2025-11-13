package br.mil.eb.decex.calendario_spring.controller;

import java.time.LocalDate;
import java.util.List;

import org.aspectj.lang.annotation.SuppressAjWarnings;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.mil.eb.decex.calendario_spring.dto.VideoConferenciaDTO;
import br.mil.eb.decex.calendario_spring.dto.VideoConferenciaPageDTO;
import br.mil.eb.decex.calendario_spring.enumerado.Acessorios;
import br.mil.eb.decex.calendario_spring.repository.VideoConferenciaRepository;
import br.mil.eb.decex.calendario_spring.service.VideoConferenciaService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@RestController
@RequestMapping("/api/videoConferencias")
public class VideoConferenciaController {

    @SuppressAjWarnings
    private final VideoConferenciaRepository videoConferenciaRepository;
    private final VideoConferenciaService videoConferenciaService;

    public VideoConferenciaController(VideoConferenciaRepository videoConferenciaRepository, VideoConferenciaService videoConferenciaService) {
        this.videoConferenciaService = videoConferenciaService;
        this.videoConferenciaRepository = videoConferenciaRepository;
    }

    @GetMapping
    public List<VideoConferenciaDTO> list() {
        return videoConferenciaService.list();
    }


     @GetMapping("/search")
    public VideoConferenciaPageDTO search(String termo, @RequestParam(defaultValue = "0") @PositiveOrZero int page,
            @RequestParam(defaultValue = "10") @Positive @Max(100) int pageSize
    ) {
        
        return videoConferenciaService.search(termo, page, pageSize);
    }

     @GetMapping("/search-agenda")
    public VideoConferenciaPageDTO searchAgenda(
        
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio, LocalDate dataFim,
        
        
        @RequestParam(defaultValue = "0") @PositiveOrZero int page,
        @RequestParam(defaultValue = "10") @Positive @Max(100) int pageSize) {
            

    return videoConferenciaService.search2(dataInicio, dataFim, page, pageSize);
}

    @GetMapping("/acessorios")
    public ResponseEntity<Acessorios[]> getAcessoriosValues() {       
        return ResponseEntity.ok(Acessorios.values());
    }

    @GetMapping ("/{id}")
    public VideoConferenciaDTO findById(@PathVariable @NotNull @Positive Long id){
        return videoConferenciaService.findById(id);
        

    } 

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public VideoConferenciaDTO create(@RequestBody @Valid VideoConferenciaDTO videoConferencia) {
        return videoConferenciaService.create(videoConferencia);
    }    

    @PutMapping("/{id}")
    public VideoConferenciaDTO update(@PathVariable @NotNull @Positive Long id, 
                @RequestBody @Valid @NotNull VideoConferenciaDTO videoConferencia) {
        return videoConferenciaService.update(id, videoConferencia);
                                    
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void delete(@PathVariable @NotNull @Positive Long id) {        
       videoConferenciaService.delete(id);
    }
}
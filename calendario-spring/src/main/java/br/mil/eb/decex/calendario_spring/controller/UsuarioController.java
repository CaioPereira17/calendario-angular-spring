package br.mil.eb.decex.calendario_spring.controller;
import java.util.List;

import br.mil.eb.decex.calendario_spring.config.JwtServiceGenerator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
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

import br.mil.eb.decex.calendario_spring.dto.UsuarioDTO;
import br.mil.eb.decex.calendario_spring.dto.UsuarioPageDTO;
import br.mil.eb.decex.calendario_spring.enumerado.PostoGraduacao;
import br.mil.eb.decex.calendario_spring.modelo.Usuario;
import br.mil.eb.decex.calendario_spring.repository.UsuarioRepository;
import br.mil.eb.decex.calendario_spring.service.UsuarioService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Validated
@RestController
@RequestMapping("api/usuarios")
public class UsuarioController {
    
    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;    

    private final JwtServiceGenerator jwtServiceGenerator;
    

    public UsuarioController(UsuarioRepository usuarioRepository, UsuarioService usuarioService, JwtServiceGenerator jwtServiceGenerator) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
        this.jwtServiceGenerator = jwtServiceGenerator;
    }


    @GetMapping
    public List <UsuarioDTO> list() {
        return usuarioService.list();

    }   
    
    @GetMapping("/search")
    public UsuarioPageDTO search(
                                @RequestParam(defaultValue = "") String termo,
                                @RequestParam(defaultValue = "0") 
                                @PositiveOrZero int page,
                                @RequestParam(defaultValue = "10") 
                                @Positive @Max(100) int pageSize
    ) {
        
        return usuarioService.findByUsernameOrRoleAndLiberadoTrue(termo, page, pageSize);
    }

    @GetMapping("/inativos")
    public UsuarioPageDTO listarUsuariosInativos(
            @RequestParam(defaultValue = "") String termo,
            @RequestParam(defaultValue = "0") @PositiveOrZero int page,
            @RequestParam(defaultValue = "10") @Positive @Max(100) int pageSize) {

        return usuarioService.findByUsernameOrRoleAndLiberadoFalse(termo, page, pageSize);
    }


    
    @PutMapping("/reativar/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reativarUsuario(@PathVariable Long id) {
    Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Usuario não encontrada"));
    usuario.setLiberado(true);
    usuarioRepository.save(usuario);
}

    @GetMapping("/estaLogado")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Boolean> isLoggedIn(HttpServletRequest request) {
        Usuario Logado = jwtServiceGenerator.GetUser(request);
        return ResponseEntity.ok(Logado != null);

    }

    @PutMapping("/alterar-senha")
    public ResponseEntity<Void> alterarSenha(@RequestParam String senhaAtual, @RequestParam String novaSenha) {
    usuarioService.alterarSenha(senhaAtual, novaSenha);
    return ResponseEntity.noContent().build();
}


    
    @GetMapping ("/{id}")
    public UsuarioDTO findById(@PathVariable @NotNull @Positive Long id){
        return usuarioService.findById(id);
        

    } 
    
    @GetMapping("/posto-graduacao")
    public ResponseEntity<PostoGraduacao[]> getPostoGraduacaoValues() {       
        return ResponseEntity.ok(PostoGraduacao.values());
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public UsuarioDTO create(@RequestBody @Valid UsuarioDTO usuario) {       
        return usuarioService.create(usuario);
    }

    @PutMapping("/{id}")
    public UsuarioDTO update(@PathVariable @NotNull @Positive Long id, 
                @RequestBody @Valid @NotNull UsuarioDTO usuario) {
        return usuarioService.update(id, usuario);
                                    
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void delete(@PathVariable @NotNull @Positive Long id) {        
       usuarioService.delete(id);
    }

}

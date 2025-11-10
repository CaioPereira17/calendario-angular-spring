package br.mil.eb.decex.calendario_spring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.mil.eb.decex.calendario_spring.enumerado.PostoGraduacao;
import br.mil.eb.decex.calendario_spring.enumerado.TipoAcesso;
import br.mil.eb.decex.calendario_spring.modelo.Assessoria;
import br.mil.eb.decex.calendario_spring.modelo.jaas.Users;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public record PessoaDTO(
        @JsonProperty("_id")
        Long id,
        @NotBlank
        @NotNull
//        @Pattern(regexp = "^\\d{9}-\\d{1}$", message = "Formato da identidade inválido. Deve estar no formato 000000000-0")
//        String identidade,
        // SUBSTITUA O PATTERN ATUAL POR ESTE: Caio
        @Pattern(regexp = "^(\\d{9}-\\d{1}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d)$", message = "Formato de identidade inválido. Use 000.000.000-0 ou 000000000-0")
        String identidade,
        Users users,
        @NotBlank
        @NotNull
        String nome,
        @NotBlank
        @NotNull
        String nomeGuerra,
        @NotNull
        PostoGraduacao postoGraduacao,
        //
        // NOVO CAMPO ADICIONADO AQUI
        //
        @NotBlank // (Equivalente ao Validators.required)
        @NotNull  // (Equivalente ao Validators.required)
        String armaquadroservico,
        @NotNull
        Assessoria assessoria,
        @NotNull
        Boolean liberado,
        @NotNull
        TipoAcesso tipoAcesso,
        //        @Pattern(regexp = "^\\d{3}-\\d{4}$", message = "Formato do ramal inválido. Deve estar no formato 000-0000")
        //        String ramal,
        // Substitua o @Pattern atual por este:
        @Pattern(regexp = "^810 - \\d{4}$", message = "Formato do ramal inválido. Deve estar no formato 810 - 0000")
        String ramal,
        @NotNull
        String caminho,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
        @NotNull
        LocalDate dataUltimaPromocao
        ) {

}

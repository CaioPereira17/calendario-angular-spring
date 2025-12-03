package br.mil.eb.decex.calendario_spring.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import br.mil.eb.decex.calendario_spring.enumerado.PostoGraduacao;
import br.mil.eb.decex.calendario_spring.enumerado.TipoAcesso;
import br.mil.eb.decex.calendario_spring.modelo.Assessoria;
import br.mil.eb.decex.calendario_spring.modelo.jaas.Users;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record PessoaDTO(
        @JsonProperty("_id")
        Long id,

        @NotBlank
        @NotNull
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

        @NotBlank
        @NotNull
        String armaquadroservico,

        @NotNull
        Assessoria assessoria,

        @NotNull
        Boolean liberado,

        @NotNull
        TipoAcesso tipoAcesso,

        // CORREÇÃO: O regex agora aceita apenas números (ex: 8105678) ou o formato formatado (ex: 810 - 5678)
        @Pattern(regexp = "^[0-9\\- ]+$", message = "Ramal inválido. Aceita apenas números, espaços e traços.")
        String ramal,

        @JsonProperty("dt_praca")
        LocalDate dtPraca,

        @NotNull
        String caminho,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
        @NotNull
        LocalDate dataUltimaPromocao
) {
}

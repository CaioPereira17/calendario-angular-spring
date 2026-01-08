//package br.mil.eb.decex.calendario_spring.dto;
//
//import com.fasterxml.jackson.annotation.JsonFormat;
//import com.fasterxml.jackson.annotation.JsonProperty;
//
//import br.mil.eb.decex.calendario_spring.enumerado.PostoGraduacao;
//import br.mil.eb.decex.calendario_spring.enumerado.TipoAcesso;
//import br.mil.eb.decex.calendario_spring.modelo.Assessoria;
//import br.mil.eb.decex.calendario_spring.modelo.jaas.Users;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;
//import jakarta.validation.constraints.Pattern;
//
//import java.time.LocalDate;
//
//public record PessoaDTO(
//        @JsonProperty("_id")
//        Long id,
//
//        @NotBlank
//        @NotNull
//        // 1. \\d{10} -> Aceita Identidade Militar (10 dígitos numéricos puros, ex: 0115404873)
//        // 2. \\d{9}-\\d{1,2} -> Aceita formato antigo sem pontos (ex: 123456789-0)
//        // 3. \\d{3}\\.\\d{3}\\.\\d{3}-\\d{1,2} -> Aceita CPF formatado
//        @Pattern(regexp = "^(\\d{10}|\\d{9}-\\d{1,2}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d{1,2})$",
//                message = "Identidade inválida. Aceita: 10 dígitos (Militar), 000000000-00 ou 000.000.000-00")
//        String identidade,
//
//        Users users,
//
//        @NotBlank
//        @NotNull
//        String nome,
//
//        @NotBlank
//        @NotNull
//        String nomeGuerra,
//
//        @NotNull
//        PostoGraduacao postoGraduacao,
//
//        @NotBlank
//        @NotNull
//        String armaquadroservico,
//
//        @NotNull
//        Assessoria assessoria,
//
//        @NotNull
//        Boolean liberado,
//
//        @NotNull
//        TipoAcesso tipoAcesso,
//
//        @Pattern(regexp = "^[0-9\\- ]+$", message = "Ramal inválido. Aceita apenas números, espaços e traços.")
//        String ramal,
//
//        @JsonProperty("dt_praca")
//        LocalDate dtPraca,
//
//        @JsonProperty("dt_nascimento")
//        LocalDate dtNascimento,
//
//        @NotNull
//        String caminho,
//
//        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
//        @NotNull
//        LocalDate dataUltimaPromocao
//) {
//}

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

        // Apenas valida SE vier preenchido. Se vier null, passa.
        @Pattern(regexp = "^(\\d{10}|\\d{9}-\\d{1,2}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d{1,2})$",
                message = "Identidade inválida.")
        String identidade,

        Users users,

        @NotBlank
        @NotNull
        String nome,

        // Sem validação (pode ser null)
        String nomeGuerra,

        @NotNull
        PostoGraduacao postoGraduacao,

        // Sem validação (pode ser null)
        String armaquadroservico,

        @NotNull
        Assessoria assessoria,

        @NotNull
        Boolean liberado,

        @NotNull
        TipoAcesso tipoAcesso,

        @Pattern(regexp = "^[0-9\\- ]+$", message = "Ramal inválido.")
        String ramal,

        @JsonProperty("dt_praca")
        LocalDate dtPraca,

        @JsonProperty("dt_nascimento")
        LocalDate dtNascimento,

        // Sem validação (pode ser null)
        String caminho,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
        // Sem validação (pode ser null)
        LocalDate dataUltimaPromocao
) {
}
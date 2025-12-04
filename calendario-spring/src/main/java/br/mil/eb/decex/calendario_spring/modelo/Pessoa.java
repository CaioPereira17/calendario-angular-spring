package br.mil.eb.decex.calendario_spring.modelo;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.SQLDelete;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.mil.eb.decex.calendario_spring.enumerado.PostoGraduacao;
import br.mil.eb.decex.calendario_spring.enumerado.TipoAcesso;
import br.mil.eb.decex.calendario_spring.modelo.jaas.Users;
import br.mil.eb.decex.calendario_spring.util.EncodingSHA256;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.time.LocalDate;

@SQLDelete(sql = "UPDATE Pessoa SET liberado = 'false' WHERE id = ?")
@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "identidade")
@ToString(of = {"identidade", "nomeGuerra"})
public class Pessoa implements Serializable {

    private static final long serialVersionUID = 1L;

    // === IDENTIFICAÇÃO ===
    @Id
    @SequenceGenerator(name = "PESSOA_ID_GENERATOR", sequenceName = "PESSOA_ID_SEQ", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PESSOA_ID_GENERATOR")
    @JsonProperty("_id")
    private Long id;

    @NotNull
    @Pattern(
            regexp = "^(\\d{9}-\\d{1}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d)$",
            message = "Formato de identidade inválido. Use 000.000.000-0 ou 000000000-0"
    )
    @Column(unique = true)
    private String identidade;

    @NotNull
    @Column
    private String nome;

    @NotNull
    @Column
    private String nomeGuerra;

    @NotNull
    @Column
    private PostoGraduacao postoGraduacao;

    private int postoGraduacaoOrdinal;

    // === RELACIONAMENTOS ===
    @NotNull
    @ManyToOne
    @JoinColumn(name = "assessoria_id")
    private Assessoria assessoria;

    @OneToOne(mappedBy = "pessoa", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private PessoaTIInfo tiInfo;

    // === ATRIBUTOS EXTRAS ===
    @Column(name = "armaquadroservico")
    private String armaquadroservico;

    @NotNull
    @Column
    private Boolean liberado = Boolean.FALSE;

    @NotNull
    @Column
    private TipoAcesso tipoAcesso;

    // DEPOIS (Permissivo, aceita números, espaços e traços):
    @NotNull
    @Pattern(
            regexp = "^[0-9\\- ]+$",
            message = "Formato do ramal inválido. Apenas números, traços e espaços são permitidos."
    )
    @Column
    private String ramal;

    @NotNull
    @Column
    private String caminho;

    @NotNull
    @Column(name="dt_nascimento")
    private LocalDate dtNascimento;

    @Column(name = "data_ultima_promocao")
    private LocalDate dataUltimaPromocao;

    @Column(name = "dt_praca")
    private LocalDate dtPraca;

    // === TRANSIENTES (não persistem no BD) ===
    @Transient
    private Users users;

    @Transient
    private List<TipoAcesso> listaTipoAcesso;

    // === MÉTODOS AUXILIARES ===
    @PrePersist
    @PreUpdate
    private void atualizarOrdinal() {
        if (postoGraduacao != null) {
            this.postoGraduacaoOrdinal = postoGraduacao.ordinal();
        }
    }

    public Users parseUsers() {
        Users users2 = new Users();
        users2.setName(identidade);
        users2.addRole(TipoAcesso.USUARIO);
        users2.setPass(EncodingSHA256.encodingBase64(identidade));
        return users2;
    }

    public Assessoria getAssessoria() {
        if (this.assessoria == null) {
            this.assessoria = new Assessoria();
        }
        return this.assessoria;
    }

    public List<TipoAcesso> getListaTipoAcesso() {
        if (listaTipoAcesso == null) {
            listaTipoAcesso = new ArrayList<>();
        }
        return listaTipoAcesso;
    }
}

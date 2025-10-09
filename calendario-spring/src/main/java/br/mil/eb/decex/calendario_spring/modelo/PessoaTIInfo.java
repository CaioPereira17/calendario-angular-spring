package br.mil.eb.decex.calendario_spring.modelo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "pessoa_ti_info")
public class PessoaTIInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "pessoa_id", nullable = false, unique = true) // Garante relação 1-1
    private Pessoa pessoa;

    private String controleAcessoId;
    private String contaAd;
    private String contaSiscau;
    private String contaSped;
}

package br.mil.eb.decex.calendario_spring.modelo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.SQLDelete;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.mil.eb.decex.calendario_spring.enumerado.PostoGraduacao;
import br.mil.eb.decex.calendario_spring.enumerado.TipoAcesso;
import br.mil.eb.decex.calendario_spring.modelo.jaas.Users;
import br.mil.eb.decex.calendario_spring.util.EncodingSHA256;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@SQLDelete(sql = "UPDATE Pessoa SET liberado = 'false' WHERE id = ? ")

@Entity
public class Pessoa implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "PESSOA_ID_GENERATOR", sequenceName = "PESSOA_ID_SEQ", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PESSOA_ID_GENERATOR")
	@JsonProperty("_id")
	private Long id;


    //    @Pattern(regexp = "^\\d{9}-\\d{1}$", message = "Formato da identidade inválido. Deve estar no formato 000000000-0")
    //	@Column(unique = true)
    //	private String identidade;
    // ATUALIZE ESTA LINHA: CAio correção
    @NotNull
    @Pattern(regexp = "^(\\d{9}-\\d{1}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d)$", message = "Formato de identidade inválido. Use 000.000.000-0 ou 000000000-0")
    @Column(unique = true)
    private String identidade;

	@Transient
	private Users users;

	@Transient
	private List<TipoAcesso> listaTipoAcesso;

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
    //Caio adição
    @Column(name = "armaquadroservico") // O nome exato da coluna no banco
    private String armaquadroservico;

    public String getArmaquadroservico() {
        return armaquadroservico;
    }

    public void setArmaquadroservico(String armaquadroservico) {
        this.armaquadroservico = armaquadroservico;
    }



	@NotNull
	@ManyToOne
	@JoinColumn(name = "assessoria_id")
	private Assessoria assessoria;

	@NotNull
	@Column
	private Boolean liberado;

	public Pessoa() {
		liberado = Boolean.FALSE;
	}

	@NotNull
	@Column
	private TipoAcesso tipoAcesso;

    //	@NotNull
    //    @Pattern(regexp = "^\\d{3}-\\d{4}$", message = "Formato do ramal inválido. Deve estar no formato 000-0000")
    //	@Column
    //	private String ramal;
    @NotNull
    // ATUALIZE ESTA LINHA:
    @Pattern(regexp = "^810 - \\d{4}$", message = "Formato do ramal inválido. Deve estar no formato 810 - 0000")
    @Column
    private String ramal;

	@NotNull
	@Column
	private String caminho;

	@NotNull
	@Column
	private String antiguidade;

	@OneToOne(mappedBy = "pessoa", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
	private PessoaTIInfo tiInfo;

	/**
	 * Identificador de tabela. Código sequencial
	 * 
	 * @return chave primária da pessoa
	 */

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * Identidade da pessoa
	 * 
	 * @return identidade da pessoa
	 */
	public String getIdentidade() {
		return identidade;
	}

	public void setIdentidade(String identidade) {
		this.identidade = identidade;
	}

	/**
	 * Nome da pessoa
	 * 
	 * @return nome da pessoa
	 */
	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	/**
	 * Nome de guerra da pessoa
	 * 
	 * @return nome de guerra da pessoa
	 */
	public String getNomeGuerra() {
		return nomeGuerra;
	}

	public void setNomeGuerra(String nomeGuerra) {
		this.nomeGuerra = nomeGuerra;
	}

	/**
	 * Posto/Graduação da pessoa
	 * 
	 * @return posto/graduação da pessoa
	 */
	public PostoGraduacao getPostoGraduacao() {
		return postoGraduacao;
	}

	public void setPostoGraduacao(PostoGraduacao postoGraduacao) {
		this.postoGraduacao = postoGraduacao;
	}

	public int getPostoGraduacaoOrdinal() {
		return postoGraduacaoOrdinal;
	}

	public void setPostoGraduacaoOrdinal(int postoGraduacaoOrdinal) {
		this.postoGraduacaoOrdinal = postoGraduacaoOrdinal;
	}

	/**
	 * Assessoria atual da pessoa
	 * 
	 * @return assessoria da pessoa
	 */
	public Assessoria getAssessoria() {
		if (this.assessoria == null) {
			this.assessoria = new Assessoria();
		}

		return this.assessoria;
	}

	public void setAssessoria(Assessoria assessoria) {
		this.assessoria = assessoria;
	}

	/**
	 * Indica liberação para a pessoa ser vizualizada no sistema de ramais
	 * 
	 * @return true-> Acesso liberado <br/>
	 *         false-> Acesso negado
	 */
	public Boolean getLiberado() {
		return liberado;
	}

	public void setLiberado(Boolean liberado) {
		this.liberado = liberado;
	}

	/**
	 * Lista com os perfis do usuário
	 */
	public Users getUsers() {
		return users;
	}

	public void setUsers(Users users) {
		this.users = users;
	}

	public List<TipoAcesso> getListaTipoAcesso() {
		if (listaTipoAcesso == null) {
			listaTipoAcesso = new ArrayList<>();
		}

		return listaTipoAcesso;
	}

	public void setListaTipoAcesso(List<TipoAcesso> listaTipoAcesso) {
		this.listaTipoAcesso = listaTipoAcesso;
	}

	public TipoAcesso getTipoAcesso() {
		return tipoAcesso;
	}

	public void setTipoAcesso(TipoAcesso tipoAcesso) {
		this.tipoAcesso = tipoAcesso;
	}

	public String getRamal() {
		return ramal;
	}

	public void setRamal(String ramal) {
		this.ramal = ramal;
	}

	public String getCaminho() {
		return caminho;
	}

	public void setCaminho(String caminho) {
		this.caminho = caminho;
	}

	public String getAntiguidade() {
		return antiguidade;
	}

	public void setAntiguidade(String antiguidade) {
		this.antiguidade = antiguidade;
	}



	@PrePersist
	@PreUpdate
	private void atualizarOrdinal() {
		if (postoGraduacao != null) {
			this.postoGraduacaoOrdinal = postoGraduacao.ordinal();
		}
	}

	/**
	 * Realiza parse para usuário JAAS. Na liberação do usuário
	 * para acesso ao sistema, por convenção a senha será a identidade
	 * criptografada
	 * 
	 * @return parse para usuário JAAS
	 */
	public Users parseUsers() {

		Users users2 = new Users();

		users2.setName(identidade);
		users2.addRole(TipoAcesso.USUARIO);
		users2.setPass(EncodingSHA256.encodingBase64(identidade));

		return users2;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((identidade == null) ? 0 : identidade.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (!(obj instanceof Pessoa))
			return false;
		Pessoa other = (Pessoa) obj;
		if (getIdentidade() == null) {
			if (other.getIdentidade() != null)
				return false;
		} else if (!getIdentidade().equals(other.getIdentidade()))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Pessoa [identidade=" + identidade + ", nomeGuerra=" + nomeGuerra + "]";
	}

}
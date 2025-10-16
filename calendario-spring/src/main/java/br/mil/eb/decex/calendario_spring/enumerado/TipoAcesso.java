package br.mil.eb.decex.calendario_spring.enumerado;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Enumerado para definição dos perfis do usuário<p/>
 * 
 * <b>USUARIO</b> - Usuário de sistema, possui permissão para inserir obrigações 
 * apenas em sua assessoria <p/>
 * <b>ADMINISTRADOR</b> - Administrador, possui permissão para liberar acesso para 
 * usuários do sistema <p/>
 * <b>AUDITORIO</b> - Possui permissão para registrar agendamentos para o Auditório do DECEx
 * 
 * @author <b>Vanilton</b> Gomes dos Santos - 2º Sgt QE
 * @version 1.1 (Incluído perfil AUDITORIO)
 */
public enum     TipoAcesso {
	ADMINISTRADOR("Administrador"),
	DIV_PESS("Divisão de Pessoal"),
	AGENDAMENTO("Agendamento"),
    TI("TI"),
    USUARIO("Usuário");
	
	private String value;

    private TipoAcesso(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static PostoGraduacao fromValue(String value) {
        for (PostoGraduacao posto : PostoGraduacao.values()) {
            if (posto.getValue().equalsIgnoreCase(value)) {
                return posto;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }

    @Override
    public String toString() {        
        return value;
    }
	
}

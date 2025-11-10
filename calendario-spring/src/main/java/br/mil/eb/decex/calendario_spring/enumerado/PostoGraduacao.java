package br.mil.eb.decex.calendario_spring.enumerado;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PostoGraduacao {

    GEN_EXERCITO("Gen Ex", 1),//1000
	GEN_DIVISAO("Gen Div", 2),//1100
	GEN_BRIGADA("Gen Bda", 3),//1200
	CORONEL("Cel", 4),//2000
	TEN_CORONEL("Ten Cel", 5),//3000
	MAJOR("Maj", 6),//4000
	CAPITAO("Cap", 7),//5000
	PRI_TENENTE("1º Ten", 8),//6000
	SEG_TENENTE("2º Ten", 9),//6500
	ASP("Asp", 10),//6700
	SUBTENENTE("ST", 11),//7000
	PRI_SARGENTO("1º SGT", 12),//7200
	SEG_SARGENTO("2º SGT", 13),//7400
	TER_SARGENTO("3º SGT", 14),//7600
	CABO("Cabo", 15),//8000
	SOLDADO("Soldado", 16),//8500
	FUNC_CIV("Funcionário Civil", 17);//9000
	
	private String value;
    private int ordem;

    private PostoGraduacao(String value, int ordem) {
        this.value = value;
        this.ordem = ordem;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    public int getOrdem() {
        return ordem;
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

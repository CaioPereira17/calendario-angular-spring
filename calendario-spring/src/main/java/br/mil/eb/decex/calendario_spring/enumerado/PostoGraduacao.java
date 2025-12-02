//package br.mil.eb.decex.calendario_spring.enumerado;
//
//import com.fasterxml.jackson.annotation.JsonCreator;
//import com.fasterxml.jackson.annotation.JsonValue;
//
//public enum PostoGraduacao {
//
//    GEN_EXERCITO("Gen Ex", 1),//1000
//	GEN_DIVISAO("Gen Div", 2),//1100
//	GEN_BRIGADA("Gen Bda", 3),//1200
//	CORONEL("Cel", 4),//2000
//	TEN_CORONEL("Ten Cel", 5),//3000
//	MAJOR("Maj", 6),//4000
//	CAPITAO("Cap", 7),//5000
//	PRI_TENENTE("1º Ten", 8),//6000
//	SEG_TENENTE("2º Ten", 9),//6500
//	ASP("Asp", 10),//6700
//	SUBTENENTE("ST", 11),//7000
//	PRI_SARGENTO("1º SGT", 12),//7200
//	SEG_SARGENTO("2º SGT", 13),//7400
//	TER_SARGENTO("3º SGT", 14),//7600
//	CABO("Cabo", 15),//8000
//	SOLDADO("Soldado", 16),//8500
//	FUNC_CIV("Funcionário Civil", 17);//9000
//
//	private String value;
//    private int ordem;
//
//    private PostoGraduacao(String value, int ordem) {
//        this.value = value;
//        this.ordem = ordem;
//    }
//
//    @JsonValue
//    public String getValue() {
//        return value;
//    }
//
//    public int getOrdem() {
//        return ordem;
//    }
//
//    @JsonCreator
//    public static PostoGraduacao fromValue(String value) {
//        for (PostoGraduacao posto : PostoGraduacao.values()) {
//            if (posto.getValue().equalsIgnoreCase(value)) {
//                return posto;
//            }
//        }
//        throw new IllegalArgumentException("Unknown enum value: " + value);
//    }
//
//    @Override
//    public String toString() {
//        return value;
//    }
//
//}
package br.mil.eb.decex.calendario_spring.enumerado;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PostoGraduacao {

    GEN_EXERCITO("Gen Ex", 0),
    GEN_DIVISAO("Gen Div", 1),
    GEN_DIVISAO_R1("Gen Div R1", 2), // R1
    GEN_BRIGADA("Gen Bda", 3),
    GEN_BRIGADA_R1("Gen Bda R1", 4), // R1
    CORONEL("Cel", 5),
    CORONEL_R1("Cel R1", 6),         // R1
    TEN_CORONEL("Ten Cel", 7),
    TEN_CORONEL_R1("Ten Cel R1", 8), // R1
    MAJOR("Maj", 9),
    MAJOR_R1("Maj R1", 10),          // R1
    CAPITAO("Cap", 11),
    CAPITAO_R1("Cap R1", 12),        // R1
    PRI_TENENTE("1º Ten", 13),
    PRI_TENENTE_R1("1º Ten R1", 14), // R1
    SEG_TENENTE("2º Ten", 15),
    SEG_TENENTE_R1("2º Ten R1", 16), // R1
    ASP("Asp", 17),
    ASP_R1("Asp R1", 18),            // R1
    SUBTENENTE("ST", 19),
    SUBTENENTE_R1("ST R1", 20),      // R1
    PRI_SARGENTO("1º SGT", 21),
    PRI_SARGENTO_R1("1º SGT R1", 22),// R1
    SEG_SARGENTO("2º SGT", 23),
    SEG_SARGENTO_R1("2º SGT R1", 24),// R1
    TER_SARGENTO("3º SGT", 25),
    TER_SARGENTO_R1("3º SGT R1", 26),// R1
    CABO("Cabo", 27),
    SOLDADO("Soldado", 28),
    FUNC_CIV("Funcionário Civil", 29);

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

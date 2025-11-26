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

    GEN_EXERCITO("Gen Ex", 1),
    GEN_DIVISAO("Gen Div", 2),
    GEN_DIVISAO_R1("Gen Div R1", 3), // R1
    GEN_BRIGADA("Gen Bda", 4),
    GEN_BRIGADA_R1("Gen Bda R1", 5), // R1
    CORONEL("Cel", 6),
    CORONEL_R1("Cel R1", 7),         // R1
    TEN_CORONEL("Ten Cel", 8),
    TEN_CORONEL_R1("Ten Cel R1", 9), // R1
    MAJOR("Maj", 10),
    MAJOR_R1("Maj R1", 11),          // R1
    CAPITAO("Cap", 12),
    CAPITAO_R1("Cap R1", 13),        // R1
    PRI_TENENTE("1º Ten", 14),
    PRI_TENENTE_R1("1º Ten R1", 15), // R1
    SEG_TENENTE("2º Ten", 16),
    SEG_TENENTE_R1("2º Ten R1", 17), // R1
    ASP("Asp", 18),
    ASP_R1("Asp R1", 19),            // R1
    SUBTENENTE("ST", 20),
    SUBTENENTE_R1("ST R1", 21),      // R1
    PRI_SARGENTO("1º SGT", 22),
    PRI_SARGENTO_R1("1º SGT R1", 23),// R1
    SEG_SARGENTO("2º SGT", 24),
    SEG_SARGENTO_R1("2º SGT R1", 25),// R1
    TER_SARGENTO("3º SGT", 26),
    TER_SARGENTO_R1("3º SGT R1", 27),// R1
    CABO("Cabo", 28),
    SOLDADO("Soldado", 29),
    FUNC_CIV("Funcionário Civil", 30);

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

package br.mil.eb.decex.calendario_spring.enumerado;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PostoGraduacao {

    GEN_EXERCITO("Gen Ex", 0),
    GEN_DIVISAO("Gen Div", 1),
    GEN_DIVISAO_R1("Gen Div R1", 2),
    GEN_BRIGADA("Gen Bda", 3),
    GEN_BRIGADA_R1("Gen Bda R1", 4),
    CORONEL("Cel", 5),
    CORONEL_R1("Cel R1", 6),
    TEN_CORONEL("Ten Cel", 7),
    TEN_CORONEL_R1("Ten Cel R1", 8),
    MAJOR("Maj", 9),
    MAJOR_R1("Maj R1", 10),
    CAPITAO("Cap", 11),
    CAPITAO_R1("Cap R1", 12),
    PRI_TENENTE("1º Ten", 13),
    PRI_TENENTE_R1("1º Ten R1", 14),
    SEG_TENENTE("2º Ten", 15),
    SEG_TENENTE_R1("2º Ten R1", 16),
    ASP("Asp", 17),
    ASP_R1("Asp R1", 18),
    SUBTENENTE("ST", 19),
    SUBTENENTE_R1("ST R1", 20),
    PRI_SARGENTO("1º SGT", 21),
    PRI_SARGENTO_R1("1º SGT R1", 22),
    SEG_SARGENTO("2º SGT", 23),
    SEG_SARGENTO_R1("2º SGT R1", 24),
    TER_SARGENTO("3º SGT", 25),
    TER_SARGENTO_R1("3º SGT R1", 26),
    CABO("Cabo", 27),
    SOLDADO("Soldado", 28),
    FUNC_CIV("Funcionário Civil", 29);

    private final String value; // O nome visual (Ex: "Cel")
    private final int ordem;    // A ordem hierárquica

    // Construtor ÚNICO que recebe os dois parâmetros definidos acima
    private PostoGraduacao(String value, int ordem) {
        this.value = value;
        this.ordem = ordem;
    }

    // --- GETTERS ---

    @JsonValue
    public String getValue() {
        return value;
    }

    // ADICIONADO: O método que o RelatorioService está chamando.
    // Ele apenas retorna o 'value' existente.
    public String getViewValue() {
        return value;
    }

    public int getOrdem() {
        return ordem;
    }

    // --- MÉTODOS AUXILIARES ---

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
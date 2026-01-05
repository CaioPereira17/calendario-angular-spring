//package br.mil.eb.decex.calendario_spring.config;
//
//import io.jsonwebtoken.SignatureAlgorithm;
//
//public class JwtConfig {
//    //Todo adicionar varial de ambiente para secret_key  PRIORIDADE MÁXIMA
//	//Parâmetros para geração do token
//	public static final String SECRET_KEY = "UMACHAVESECRETADASUAAPIAQUIUMACHAVESECRETADASUAAPIAQUIUMACHAVESECRETADASUAAPIAQUIUMACHAVESECRETADASUAAPIAQUI";
//	@SuppressWarnings("deprecation")
//	public static final SignatureAlgorithm ALGORITMO_ASSINATURA = SignatureAlgorithm.HS256;
//	public static final int HORAS_EXPIRACAO_TOKEN = 1;
//
//}
package br.mil.eb.decex.calendario_spring.config;

import io.jsonwebtoken.SignatureAlgorithm;

public class JwtConfig {
    //Todo adicionar varial de ambiente para secret_key  PRIORIDADE MÁXIMA
    //Parâmetros para geração do token

    // Obs: Esta chave deve ter pelo menos 256 bits para o algoritmo HS256 ser seguro.
    // A sua string longa atual é perfeita para isso.
    public static final String SECRET_KEY = "UMACHAVESECRETADASUAAPIAQUIUMACHAVESECRETADASUAAPIAQUIUMACHAVESECRETADASUAAPIAQUIUMACHAVESECRETADASUAAPIAQUI";

    // Removida a anotação desnecessária
    public static final SignatureAlgorithm ALGORITMO_ASSINATURA = SignatureAlgorithm.HS256;

    public static final int HORAS_EXPIRACAO_TOKEN = 1;
}
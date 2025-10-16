package br.mil.eb.decex.calendario_spring.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig  {

	@Autowired
	private JwtAuthenticationFilter jwtAuthFilter;

	@Autowired
	private AuthenticationProvider authenticationProvider;


	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
		.csrf(AbstractHttpConfigurer::disable)
		.cors(AbstractHttpConfigurer::disable)
		.authorizeHttpRequests((requests) -> requests
				.requestMatchers("/api/login").permitAll()//permite acesso acesso sem autenticação.
				.requestMatchers("/api/register").permitAll()//permite acesso sem autenticação para o usuário se cadastrar.
				.requestMatchers("/enumerado/**").permitAll() // Permitir acesso público aos enumeradores
				.requestMatchers("/media/**").permitAll() // Permitir acesso público às imagens

				.requestMatchers("/api/auditorios/**").permitAll() // Permitir acesso público a tela de auditorios
				.requestMatchers("/api/pessoas/**").permitAll() // Permitir acesso público a lista de pessoas
				.requestMatchers("/api/assessorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/videoConferencias/**").authenticated()
				// .requestMatchers("/api/{id}/confirmar").permitAll() // Permitir acesso público a lista de pessoas
				// .requestMatchers("/api/pessoas/inativas/**").permitAll() // Libera apenas para ADMIN
            	.requestMatchers("/api/pessoas/reativar/**").hasAuthority("ROLE_ADMINISTRADOR") // Libera o reativar para ADMIN
				// .requestMatchers("/api/usuarios/reativar/**").hasAuthority("ROLE_ADMINISTRADOR") // Libera o reativar para ADMIN
				// .requestMatchers("/api/usuarios/**").hasAuthority("ROLE_ADMINISTRADOR") // Libera o reativar para ADMIN
                .requestMatchers("/api/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ROLE_TI")
				.requestMatchers("/api/pessoas/*/ti-info").hasAnyAuthority("TI", "ADMINISTRADOR") // Sem "ROLE_"
				.anyRequest().authenticated())
		.authenticationProvider(authenticationProvider)
		.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
		.sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}

	@Bean
	public FilterRegistrationBean<CorsFilter> corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.addAllowedOrigin("http://localhost:4200");
		config.setAllowedHeaders(Arrays.asList(HttpHeaders.AUTHORIZATION,HttpHeaders.CONTENT_TYPE,HttpHeaders.ACCEPT));
		config.setAllowedMethods(Arrays.asList(HttpMethod.GET.name(),HttpMethod.POST.name(),HttpMethod.PUT.name(),HttpMethod.DELETE.name()));
		config.setMaxAge(3600L);
		source.registerCorsConfiguration("/**", config);
		FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<CorsFilter>(new CorsFilter(source));
		bean.setOrder(-102);
		return bean;
	}


}
//package br.mil.eb.decex.calendario_spring.config;
//
//import java.util.Arrays;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.web.servlet.FilterRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.filter.CorsFilter;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Autowired
//    private JwtAuthenticationFilter jwtAuthFilter;
//
//    @Autowired
//    private AuthenticationProvider authenticationProvider;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(AbstractHttpConfigurer::disable)
//                .cors(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests((requests) -> requests
//                        // =================================================================
//                        // 1. Endpoints Públicos (Acesso SEM LOGIN)
//                        // =================================================================
//                        // Rotas de utilidade e login
//                        .requestMatchers("/api/login", "/api/register", "/enumerado/**", "/media/**").permitAll()
//
//                        // Regra específica: TODOS podem VER (GET) pessoas e auditórios
//                        .requestMatchers(HttpMethod.GET, "/api/pessoas/**", "/api/auditorios/**").permitAll()
//
//                        // =================================================================
//                        // 2. Acesso Exclusivo do ADMINISTRADOR
//                        // =================================================================
//                        .requestMatchers("/api/inativas/**").hasAuthority("ROLE_ADMINISTRADOR")
//                        .requestMatchers("/api/usuarios/**").hasAuthority("ROLE_ADMINISTRADOR")
////                        .requestMatchers("/api/assessorias/**").hasAuthority("ROLE_ADMINISTRADOR")
//                        .requestMatchers(HttpMethod.GET, "/api/assessorias/**").permitAll()
//
//                        // =================================================================
//                        // 3. Regras de Modificação (POST, PUT, DELETE etc.)
//                        // Permite que SÓ o ADMIN modifique (POST, PUT, DELETE)
//                        .requestMatchers("/api/assessorias/**").hasAuthority("ROLE_ADMINISTRADOR")
//                        // =================================================================
//                        // Quem pode MODIFICAR Pessoas (todos, exceto AGENDAMENTO)
//                        .requestMatchers(HttpMethod.POST, "/api/pessoas/**").hasAnyAuthority("ROLE_ADMINISTRADOR","ROLE_DIV_PESS")
//                        .requestMatchers(HttpMethod.PUT, "/api/pessoas/**").hasAnyAuthority("ROLE_ADMINISTRADOR","ROLE_DIV_PESS")
//                        .requestMatchers(HttpMethod.DELETE, "/api/pessoas/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ROLE_DIV_PESS")
//
//                        // Quem pode MODIFICAR Auditórios e Videoconferências (todos os perfis logados)
//                        .requestMatchers(HttpMethod.POST, "/api/auditorios/**", "/api/videoConferencias/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ROLE_AGENDAMENTO")
//                        .requestMatchers(HttpMethod.PUT, "/api/auditorios/**", "/api/videoConferencias/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ROLE_AGENDAMENTO")
//                        .requestMatchers(HttpMethod.DELETE, "/api/auditorios/**", "/api/videoConferencias/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ROLE_AGENDAMENTO")
//
//                        // O perfil de TI, Div_Pess e Usuário também podem apenas VER (GET) as videoconferências, além do acesso público a auditórios
//                        .requestMatchers(HttpMethod.GET, "/api/videoConferencias/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ROLE_TI", "ROLE_DIV_PESS", "ROLE_AGENDAMENTO", "ROLE_USUARIO")
//
//
//                        // =================================================================
//                        // 4. Qualquer outra requisição deve ser autenticada
//                        // =================================================================
//                        .anyRequest().authenticated()
//                )
//                .authenticationProvider(authenticationProvider)
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
//                .sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//
//        return http.build();
//    }
//
//    @Bean
//    public FilterRegistrationBean<CorsFilter> corsFilter() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.addAllowedOrigin("http://localhost:4200");
//        config.setAllowedHeaders(Arrays.asList(HttpHeaders.AUTHORIZATION, HttpHeaders.CONTENT_TYPE, HttpHeaders.ACCEPT));
//        config.setAllowedMethods(Arrays.asList(HttpMethod.GET.name(), HttpMethod.POST.name(), HttpMethod.PUT.name(), HttpMethod.DELETE.name()));
//        config.setMaxAge(3600L);
//        source.registerCorsConfiguration("/**", config);
//        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
//        bean.setOrder(-102);
//        return bean;
//    }
//}


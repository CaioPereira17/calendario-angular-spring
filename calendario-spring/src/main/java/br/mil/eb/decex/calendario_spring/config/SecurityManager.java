//package br.mil.eb.decex.calendario_spring.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//import br.mil.eb.decex.calendario_spring.repository.LoginRepository;
//
//@Configuration
//public class SecurityManager {
//
//	@Autowired
//	private LoginRepository loginRepository;
//
//
//	@Bean
//	public PasswordEncoder passwordEncoder() {
//		return new BCryptPasswordEncoder();
//	}
//
//
//	@Bean
//	public AuthenticationProvider authenticationProvider() {
//		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//		authProvider.setUserDetailsService(userDetailsService());
//		authProvider.setPasswordEncoder(passwordEncoder());
//		return authProvider;
//	}
//
//	@Bean
//	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//		return config.getAuthenticationManager();
//	}
//
//
//	@Bean
//	public UserDetailsService userDetailsService() {
//		return username -> loginRepository.findByUsername(username)
//				.orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado") );
//	}
//
//
//}
//
//
//
package br.mil.eb.decex.calendario_spring.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.mil.eb.decex.calendario_spring.repository.LoginRepository;

@Configuration
public class SecurityManager {

    @Autowired
    private LoginRepository loginRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // Expandimos a lambda para um bloco com {} para poder adicionar o log
        return username -> {
            // 1. Buscamos o usuário no banco de dados
            UserDetails userDetails = loginRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));

            // 2. ADICIONAMOS O LOG DE DEBUG AQUI
//            System.out.println("\n\n=============== DEBUG PONTO 1: UserDetailsService (SecurityManager) ===============");
//            System.out.println("Usuário carregado do banco: " + userDetails.getUsername());
//            System.out.println("Permissões (Authorities) encontradas: " + userDetails.getAuthorities());
//            System.out.println("====================================================================================\n\n");

            // 3. Retornamos o usuário encontrado
            return userDetails;
        };
    }
}
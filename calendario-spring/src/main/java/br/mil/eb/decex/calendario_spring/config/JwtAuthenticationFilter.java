//package br.mil.eb.decex.calendario_spring.config;
//
////JwtAuthenticationFilter.java
//
//import java.io.IOException;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.lang.NonNull;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//@Component
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//	@Autowired
//	private JwtServiceGenerator jwtService;
//	@Autowired
//	private UserDetailsService userDetailsService;
//
//	@Override
//	protected void doFilterInternal(
//			@NonNull HttpServletRequest request,
//			@NonNull HttpServletResponse response,
//			@NonNull FilterChain filterChain
//			) throws ServletException, IOException {
//		final String authHeader = request.getHeader("Authorization");
//		final String jwt;
//		final String userEmail;
//		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
//			filterChain.doFilter(request,response);
//			return;
//		}
//		jwt = authHeader.substring(7);
//		userEmail = jwtService.extractUsername(jwt);
//		if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//			UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
//			if(jwtService.isTokenValid(jwt, userDetails)) {
//				UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//						userDetails,
//						null,
//						userDetails.getAuthorities()
//						);
//				authToken.setDetails(
//						new WebAuthenticationDetailsSource().buildDetails(request)
//						);
//				SecurityContextHolder.getContext().setAuthentication(authToken);
//			}
//		}
//		filterChain.doFilter(request, response);
//	}
//}
package br.mil.eb.decex.calendario_spring.config;

//JwtAuthenticationFilter.java

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtServiceGenerator jwtService;
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request,response);
            return;
        }
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);
        if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if(jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);

                // --- CÓDIGO DE DEBUG ADICIONADO AQUI ---
                System.out.println("\n\n=============== DEBUG PONTO 2: JwtAuthenticationFilter ===============");
                System.out.println("Usuário autenticado e inserido no Contexto de Segurança.");
                System.out.println("Objeto de autenticação: " + SecurityContextHolder.getContext().getAuthentication());
                System.out.println("======================================================================\n\n");
                // ------------------------------------------
            }
        }
        filterChain.doFilter(request, response);
    }
}
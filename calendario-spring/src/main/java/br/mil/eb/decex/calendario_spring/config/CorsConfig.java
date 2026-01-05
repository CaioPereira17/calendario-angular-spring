// package br.mil.eb.decex.calendario_spring.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class CorsConfig {

//     @Bean
//     public WebMvcConfigurer mvcConfigurer() {
//         return new WebMvcConfigurer() {
//             public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry){
//                 registry.addMapping("/api/pessoas/**")
//                     .allowedOrigins("*")
//                     .allowedMethods("*");
//             }
//         };
//     }

// }


package br.mil.eb.decex.calendario_spring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer mvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override // Boa prática: Garante que estamos sobrescrevendo corretamente
            public void addCorsMappings(CorsRegistry registry) {
                // Removida anotação @SuppressWarnings("null") desnecessária
                registry.addMapping("/api/pessoas/**")
                        .allowedOrigins("*")
                        .allowedMethods("*");
            }
        };
    }

}
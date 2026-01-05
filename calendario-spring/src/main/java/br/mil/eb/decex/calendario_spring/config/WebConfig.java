// package br.mil.eb.decex.calendario_spring.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig implements WebMvcConfigurer {

//     @Override
//     public void addResourceHandlers(@SuppressWarnings("null") ResourceHandlerRegistry registry) {
//         registry.addResourceHandler("/mediaFiles/**")
//                 .addResourceLocations("file:mediaFiles/");
//     }

//     @Override
//     public void addCorsMappings(@SuppressWarnings("null") CorsRegistry registry) {
//         registry.addMapping("/**").allowedOrigins("http://localhost:4200");
//     }
// }

package br.mil.eb.decex.calendario_spring.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Removida anotação @SuppressWarnings("null") desnecessária
        registry.addResourceHandler("/mediaFiles/**")
                .addResourceLocations("file:mediaFiles/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Removida anotação @SuppressWarnings("null") desnecessária
        registry.addMapping("/**").allowedOrigins("http://localhost:4200");
    }
}
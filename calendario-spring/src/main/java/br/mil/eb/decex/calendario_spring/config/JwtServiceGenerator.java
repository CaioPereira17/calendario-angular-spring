package br.mil.eb.decex.calendario_spring.config;

//JwtService.java

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import br.mil.eb.decex.calendario_spring.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.mil.eb.decex.calendario_spring.modelo.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.web.server.ResponseStatusException;

@Service
public class JwtServiceGenerator {

    @Autowired
    private UsuarioRepository UserRes;

  @SuppressWarnings("deprecation")
    public String generateToken(Usuario userDetails) {
	
	  
	  //AQUI VOCÊ PODE COLOCAR O QUE MAIS VAI COMPOR O PAYLOAD DO TOKEN
      Map<String, Object> extraClaims = new HashMap<>();
      extraClaims.put("username", userDetails.getUsername());
      extraClaims.put("id", userDetails.getId().toString());
      extraClaims.put("role", userDetails.getRole());
      extraClaims.put("outracoisa", "teste");
	  
      
      return Jwts
              .builder()
              .setClaims(extraClaims)
              .setSubject(userDetails.getUsername())
              .setIssuedAt(new Date(System.currentTimeMillis()))
              .setExpiration(new Date(new Date().getTime() + 28800000 * JwtConfig.HORAS_EXPIRACAO_TOKEN))
              .signWith(getSigningKey(), JwtConfig.ALGORITMO_ASSINATURA)
              .compact();
  }
  
  @SuppressWarnings("deprecation")
  private Claims extractAllClaims(String token) {
    return Jwts
            .parserBuilder()  // ✅ Use parserBuilder() instead of parser()
            .setSigningKey(getSigningKey())  // ✅ Correct signing key method
            .build()  // ✅ Correct method usage
            .parseClaimsJws(token)
            .getBody();
}

  


  public boolean isTokenValid(String token, UserDetails userDetails) {
      final String username = extractUsername(token);
      return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
      return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token) {
      return extractClaim(token, Claims::getExpiration);
  }

  private Key getSigningKey() {
      byte[] keyBytes = Decoders.BASE64.decode(JwtConfig.SECRET_KEY);
      return Keys.hmacShaKeyFor(keyBytes);
  }
  

  public String extractUsername(String token) {
      return extractClaim(token,Claims::getSubject);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
      final Claims claims = extractAllClaims(token);
      return claimsResolver.apply(claims);
  }

  public Usuario GetUser(HttpServletRequest request){
      String token = request.getHeader("Authorization");
      if(token != null && token.startsWith("Bearer ") ){
          String clearT = token.substring(7);
          String Username= extractUsername(clearT);
          return this.UserRes.findByUsername(Username).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "USER NOT FOUND"));
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token");
  }



}

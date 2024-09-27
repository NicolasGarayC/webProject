package com.project.controller;
import com.project.model.*;
import com.project.repository.UsuarioRepository;
import com.project.security.JwtService;
import com.project.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private static final Logger nuijhni6logger = LoggerFactory.getLogger(UsuarioController.class);
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TokenGenerator tokenGenerator;
    private final PasswordEncoder passwordEncoder;


    @GetMapping("/getusuario/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable int id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/insertarUsuario")
    public ResponseEntity<Map<String, String>> insertarUsuario(@RequestBody Map<String, Object> usuarioData) {
        Map<String, String> response = new HashMap<>();

        String correo = (String) usuarioData.get("correo");
        String passwd = (String) usuarioData.get("passwd");
        int cedula = (int) usuarioData.get("cedula");
        String nombre = (String) usuarioData.get("nombre");
        boolean cambiarClave = (boolean) usuarioData.get("cambiarClave");
        Date fechaUltimoCambioClave = new Date();
        Role rol;
        if (((String) usuarioData.get("rol")).equals("ADMIN")) {
            rol = Role.ADMIN;
        } else if (((String) usuarioData.get("rol")).equals("OPERATIVO")) {
            rol = Role.OPERATIVO;
        } else if (((String) usuarioData.get("rol")).equals("AUDITOR")) {
            rol = Role.AUDITOR;
        } else {
            rol = Role.OPERATIVO;
        }

        if (usuarioRepository.existsByCorreo(correo)) {
            response.put("error", "El correo ya está en uso.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (usuarioRepository.existsByCedula(cedula)) {
            response.put("error", "La cédula ya está en uso.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        String valid = usuarioService.validarContrasena(passwd);
        if (!valid.equals("ok")) {
            response.put("error", "Error: " + valid);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        int token = tokenGenerator.generateToken();
        try {
            emailService.sendSimpleMessage(correo, "Token Registro Gestion de Inventarios",
                    "Este es su token de confirmación de registro, ingreselo en la aplicación: " + token);
        } catch (Exception e) {
            response.put("error", "No se pudo insertar el usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        try {
            Usuario user = Usuario.builder()
                    .correo(correo)
                    .passwd(passwordEncoder.encode(passwd))
                    .cedula(cedula)
                    .nombre(nombre)
                    .estado("Preregistro")
                    .intentosFallidos(0)
                    .cambiarClave(cambiarClave)
                    .fechaUltimoCambioClave(fechaUltimoCambioClave)
                    .token(token)
                    .rol(rol)
                    .build();

            usuarioService.insertarUsuario(user);

            response.put("message", "Se ha registrado con éxito. Al correo suministrado llegará un token de verificación para activar su cuenta.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("error", "No se pudo insertar el usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/authUsuario")
    public ResponseEntity<Map<String, String>> validarUsuario(@RequestBody LoginRequest request) {
        Map<String, String> response = new HashMap<>();

        try {
            String correo = request.getCorreo();
            String passwd = request.getPasswd();
            AuthResponse authResponse = usuarioService.validarUsuario(correo, passwd, request);

            if (authResponse != null) {
                response.put("message", "Usuario Autenticado");
                response.put("token", authResponse.getToken());
                return ResponseEntity.ok().body(response);
            } else {
                response.put("error", "Credenciales inválidas.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            response.put("error", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/confirmarregistro")
    public ResponseEntity<Map<String, String>> confirmarRegistro(@RequestBody Map<String, Object> credenciales) {
        Map<String, String> response = new HashMap<>();

        try {
            String correo = (String) credenciales.get("correo");
            Integer token = (Integer) credenciales.get("token");

            if (usuarioService.confirmarRegistro(correo, token)) {
                response.put("message", "Usuario Confirmado.");
                return ResponseEntity.ok().body(response);
            } else {
                response.put("error", "Credenciales inválidas.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            response.put("error", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/correoReestablecerContrasenia")
    public ResponseEntity<Map<String, String>> recuperarContrasenia(@RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        String correo = body.get("correo");

        if (correo != null) {
            try {
                usuarioService.correoRecuperacionContrasenia(correo);
                response.put("message", "Se ha enviado un correo de recuperación con su token a su dirección de email registrada.");
                return ResponseEntity.ok().body(response);
            } catch (Exception e) {
                response.put("error", "Error: " + e.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            response.put("error", "Correo inexistente.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/ReestablecerContrasenia/{numeroToken}")
    public ResponseEntity<Map<String, String>> reestablecerContrasenia(@PathVariable("numeroToken") int numeroToken, @RequestBody Map<String, String> body) {
        Map<String, String> response = new HashMap<>();
        String contrasenia = body.get("contrasenia");

        if (String.valueOf(numeroToken).length() == 6) {
            String resultado = usuarioService.recuperarContrasenia(numeroToken, contrasenia);
            if (resultado.equals("Contraseña actualizada con éxito.")) {
                response.put("message", resultado);
                return ResponseEntity.ok().body(response);
            } else {
                response.put("error", resultado);
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            response.put("error", "El token debe ser de seis dígitos.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/getUsuarios")
    public List<Usuario> getAll() {
        return usuarioService.getAllUsers();
    }

    @PostMapping("/RehabilitarUsuario/{numeroToken}")
    public ResponseEntity<String> rehabilitarUsuario(@PathVariable("numeroToken") int numerotoken,@RequestBody Map<String, String> body){
        String contrasenia = body.get("contrasenia");
        String valid = usuarioService.validarContrasena(contrasenia);
        if(!(valid.equals("ok"))){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + valid);
        }
        try{
            String resultado = usuarioService.recuperarContrasenia(numerotoken,contrasenia);
            if (resultado.equals("Contraseña actualizada con éxito.")) {
                return ResponseEntity.ok("Usuario reestablecido.");
            } else {
                return ResponseEntity.badRequest().body(resultado);
            }
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Token invalido.");
        }
    }
}
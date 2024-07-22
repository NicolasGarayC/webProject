package com.project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "correo", length = 45, nullable = false)
    private String correo;

    @Column(name = "passwd", length = 45, nullable = false)
    private String passwd;

    @Column(name = "cedula", length = 11)
    private int cedula;

    @Column(name = "nombre", length = 45)
    private String nombre;

    @Column(name = "estado", length = 45)
    private String estado;

    @Column(name = "cambiarclave")
    private boolean cambiarClave;


    @Column(name = "fecha_ult_cambio_clave")
    private Date fechaUltimoCambioClave;

    @Column(name = "token")
    private Integer token;

    @Column(name = "intentos_fallidos")
    private Integer intentosFallidos;

    @Column(name = "rol")
    private Role rol;

    public Usuario() {
    }

    public Usuario(String correo, String passwd, Integer cedula, String nombre, boolean cambiarClave, Date fechaUltimoCambioClave, Integer token, Role rol) {
        this.correo = correo;
        this.passwd = passwd;
        this.cedula = cedula;
        this.nombre = nombre;
        this.estado = "Preregistro";
        this.cambiarClave = cambiarClave;
        this.fechaUltimoCambioClave = fechaUltimoCambioClave;
        this.token = token;
        this.intentosFallidos = 0;
        this.rol = rol;
    }

    public String getCorreo() {
        return correo;
    }

    public String getPasswd() {
        return passwd;
    }

    public Integer getIntentosFallidos() {
        return intentosFallidos;
    }

    public void setIntentosFallidos(Integer intentosFallidos) {
        this.intentosFallidos = intentosFallidos;
    }

    public Role getRol() {
        return rol;
    }

    public void setRol(Role rol) {
        this.rol = rol;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getToken() {
        return token;
    }

    public void setToken(Integer token) {
        this.token = token;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    public Integer getCedula() {
        return cedula;
    }

    public void setCedula(int cedula) {
        this.cedula = cedula;
    }
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public boolean isCambiarClave() {
        return cambiarClave;
    }

    public void setCambiarClave(boolean cambiarClave) {
        this.cambiarClave = cambiarClave;
    }

    public Date getFechaUltimoCambioClave() {
        return fechaUltimoCambioClave;
    }

    public void setFechaUltimoCambioClave(Date fechaUltimoCambioClave) {
        this.fechaUltimoCambioClave = fechaUltimoCambioClave;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }
    @Override
    public String getPassword() {
        return this.passwd;
    }

    @Override
    public String getUsername() {
        return this.correo;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return true;
    }
}
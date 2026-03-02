package com.example.demo.auth;

public class AuthResponse {
    private String token;

    // manually added constructor and getter (Lombok annotations removed)
    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

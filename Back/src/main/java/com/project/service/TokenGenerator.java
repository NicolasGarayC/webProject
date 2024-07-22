package com.project.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class TokenGenerator {

    public static int generateToken() {
        Random random = new Random();
        StringBuilder number = new StringBuilder();

        number.append(random.nextInt(8) + 1);

        for (int i = 0; i < 5; i++) {
            number.append(random.nextInt(10));
        }
        return Integer.parseInt(number.toString());
    }
}

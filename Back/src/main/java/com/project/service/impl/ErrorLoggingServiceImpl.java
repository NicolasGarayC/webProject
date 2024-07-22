package com.project.service.impl;

import com.project.service.ErrorLoggingService;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class ErrorLoggingServiceImpl implements ErrorLoggingService {
    @Override
    public void logError(String errorLocation, Exception ex, String usedData) {
        try (FileWriter fileWriter = new FileWriter("errors.txt", true)) {
            String logEntry = String.format("(Ubicacion: %s; Error: %s; Fecha del error: %s),\n",
                    errorLocation, ex.getMessage(), LocalDateTime.now());
            fileWriter.write(logEntry);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

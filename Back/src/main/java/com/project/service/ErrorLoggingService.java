package com.project.service;

public interface ErrorLoggingService {
    void logError(String errorLocation, Exception ex, String usedData);
}

package com.phoneTech.demo.parts.exception;

public class DiagnosticFaultNotFoundException extends RuntimeException {
    public DiagnosticFaultNotFoundException(Long id) { super("Diagnostic fault not found: " + id); }
}

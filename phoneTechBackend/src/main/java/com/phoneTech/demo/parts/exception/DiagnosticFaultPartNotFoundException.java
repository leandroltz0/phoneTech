package com.phoneTech.demo.parts.exception;

public class DiagnosticFaultPartNotFoundException extends RuntimeException {
    public DiagnosticFaultPartNotFoundException(Long id) { super("Diagnostic fault not found: " + id); }
}

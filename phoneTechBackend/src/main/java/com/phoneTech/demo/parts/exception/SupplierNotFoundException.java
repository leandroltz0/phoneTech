package com.phoneTech.demo.parts.exception;

public class SupplierNotFoundException extends RuntimeException {
    public SupplierNotFoundException(Long id) { super("Supplier not found: " + id); }
}

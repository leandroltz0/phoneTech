package com.phoneTech.demo.parts.exception;

public class SparePartNotFoundException extends RuntimeException {
    public SparePartNotFoundException(Long id) { super("Spare part not found: " + id); }
}

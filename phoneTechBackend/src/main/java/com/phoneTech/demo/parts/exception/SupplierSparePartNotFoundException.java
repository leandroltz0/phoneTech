package com.phoneTech.demo.parts.exception;

public class SupplierSparePartNotFoundException extends RuntimeException {
    public SupplierSparePartNotFoundException(Long id) { super("Supplier spare-part offer not found: " + id); }
}

package com.phoneTech.demo.parts.exception;

public class InvalidRepairFaultException extends RuntimeException {

    public InvalidRepairFaultException(Long faultId) {
        super("Fault is invalid or inactive for this evaluation: " + faultId);
    }
}

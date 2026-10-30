package com.phoneTech.demo.devices.exception;

public class DeviceVariantNotFoundException extends RuntimeException {

    public DeviceVariantNotFoundException(Long variantId) {
        super("Device variant not found: " + variantId);
    }
}

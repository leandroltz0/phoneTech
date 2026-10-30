package com.phoneTech.demo.devices.exception;

public class DeviceNotFoundException extends RuntimeException {

    public DeviceNotFoundException(Long deviceId) {
        super("Device not found: " + deviceId);
    }
}

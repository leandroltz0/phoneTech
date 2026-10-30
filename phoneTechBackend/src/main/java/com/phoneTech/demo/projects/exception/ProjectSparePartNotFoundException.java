package com.phoneTech.demo.projects.exception;

public class ProjectSparePartNotFoundException extends RuntimeException {
    public ProjectSparePartNotFoundException(Long id) {
        super("Project spare part not found: " + id);
    }
}

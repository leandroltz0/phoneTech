package com.phoneTech.demo.projects.exception;

public class ProjectNotFoundException extends RuntimeException {

    public ProjectNotFoundException(Long projectId) {
        super("Project not found: " + projectId);
    }
}

package com.phoneTech.demo.projects.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "app.storage")
public record StorageProperties(@DefaultValue("./uploads") String uploadDir) {
}

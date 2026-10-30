package com.phoneTech.demo.projects.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalDiskStorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(LocalDiskStorageService.class);

    private final Path rootDirectory;

    public LocalDiskStorageService(StorageProperties properties) {
        this.rootDirectory = Paths.get(properties.uploadDir()).toAbsolutePath().normalize();
        createRootDirectory();
    }

    @Override
    public String store(MultipartFile file, String extension) {
        String fileName = UUID.randomUUID() + "." + extension;
        Path target = rootDirectory.resolve(fileName);
        try {
            file.transferTo(target);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not store uploaded image", e);
        }
        return fileName;
    }

    @Override
    public void delete(String fileName) {
        try {
            Files.deleteIfExists(rootDirectory.resolve(fileName));
        } catch (IOException e) {
            logger.warn("Could not delete stored image {}: {}", fileName, e.getMessage());
        }
    }

    private void createRootDirectory() {
        try {
            Files.createDirectories(rootDirectory);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create upload directory " + rootDirectory, e);
        }
    }
}

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
        return store(file, extension, "");
    }

    @Override
    public String store(MultipartFile file, String extension, String relativeDirectory) {
        String fileName = UUID.randomUUID() + "." + extension;
        Path directory = resolveDirectory(relativeDirectory);
        createDirectory(directory);
        Path target = directory.resolve(fileName);
        try {
            file.transferTo(target);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not store uploaded image", e);
        }
        return fileName;
    }

    @Override
    public void delete(String fileName) {
        delete("", fileName);
    }

    @Override
    public void delete(String relativeDirectory, String fileName) {
        try {
            Files.deleteIfExists(resolveDirectory(relativeDirectory).resolve(fileName));
        } catch (IOException e) {
            logger.warn("Could not delete stored image {}: {}", fileName, e.getMessage());
        }
    }

    private void createRootDirectory() {
        createDirectory(rootDirectory);
    }

    private void createDirectory(Path directory) {
        try {
            Files.createDirectories(directory);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create upload directory " + directory, e);
        }
    }

    private Path resolveDirectory(String relativeDirectory) {
        Path directory = rootDirectory.resolve(relativeDirectory == null ? "" : relativeDirectory).normalize();
        if (!directory.startsWith(rootDirectory)) {
            throw new IllegalArgumentException("Invalid storage directory");
        }
        return directory;
    }
}

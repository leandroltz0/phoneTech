package com.phoneTech.demo.projects.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String store(MultipartFile file, String extension);

    String store(MultipartFile file, String extension, String relativeDirectory);

    void delete(String fileName);

    void delete(String relativeDirectory, String fileName);
}

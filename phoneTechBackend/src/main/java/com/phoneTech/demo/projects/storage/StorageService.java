package com.phoneTech.demo.projects.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String store(MultipartFile file, String extension);

    void delete(String fileName);
}

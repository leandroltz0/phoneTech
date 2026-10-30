package com.phoneTech.demo.devices.controller;
import com.phoneTech.demo.devices.dto.DiagnosisCategoryResponse; import com.phoneTech.demo.devices.service.DeviceService; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/v1/diagnosis/categories") public class DiagnosisController{private final DeviceService service;public DiagnosisController(DeviceService service){this.service=service;}@GetMapping public List<DiagnosisCategoryResponse> getCategories(){return service.getDiagnosisCategories();}}

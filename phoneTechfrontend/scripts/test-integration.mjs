import { execSync } from 'node:child_process';
import assert from 'node:assert';

const API_BASE = 'http://127.0.0.1:8080';
const LAN_API_BASE = 'http://192.168.1.50:8080';

async function runTests() {
  console.log('====================================================');
  console.log('INSPECCIÓN TÉCNICA Y PRUEBAS DE INTEGRACIÓN E2E');
  console.log('====================================================\n');

  // 1. Verificación directa en PostgreSQL
  console.log('1. [PostgreSQL] Consultando datos reales en phoneTech_db...');
  const psqlProjects = execSync(
    `PGPASSWORD=paco psql -U postgres -h localhost -d phoneTech_db -t -A -c "SELECT id, project_number, phone_model, estimated_profit, status FROM projects WHERE id = 3;"`
  ).toString().trim();
  console.log('   Fila en projects:', psqlProjects);
  assert.ok(psqlProjects.includes('Samsung Galaxy A03'), 'El proyecto Samsung Galaxy A03 debe estar en projects');

  const psqlFaults = execSync(
    `PGPASSWORD=paco psql -U postgres -h localhost -d phoneTech_db -t -A -c "SELECT pf.id, pf.project_id, df.component_name, df.fault_name, pf.confirmed FROM project_faults pf JOIN diagnostic_fault_catalog df ON df.id = pf.fault_id WHERE pf.project_id = 3;"`
  ).toString().trim().split('\n');
  console.log('   Fallas relacionadas en project_faults:', psqlFaults);
  assert.strictEqual(psqlFaults.length, 2, 'Deben existir exactamente 2 fallas para el proyecto 3');
  assert.ok(psqlFaults.some((f) => f.includes('Módulo')), 'Debe incluir falla de Módulo');
  assert.ok(psqlFaults.some((f) => f.includes('Tapa trasera')), 'Debe incluir falla de Tapa trasera');

  const psqlImages = execSync(
    `PGPASSWORD=paco psql -U postgres -h localhost -d phoneTech_db -t -A -c "SELECT id, file_name, sort_order FROM project_images WHERE project_id = 3;"`
  ).toString().trim();
  console.log('   Imágenes en project_images:', psqlImages);
  assert.ok(psqlImages.includes('.jpg'), 'Debe existir una imagen para el proyecto 3');
  console.log('   -> PostgreSQL: OK\n');

  // 2. Verificación de Spring Boot: GET /api/v1/projects (localhost y LAN)
  console.log('2. [Spring Boot] Probando GET /api/v1/projects...');
  for (const base of [API_BASE, LAN_API_BASE]) {
    const res = await fetch(`${base}/api/v1/projects`, {
      headers: { Accept: 'application/json' }
    });
    assert.strictEqual(res.status, 200, `Debe responder 200 en ${base}`);
    const data = await res.json();
    assert.ok(Array.isArray(data), 'La respuesta debe ser una lista');
    assert.ok(data.length >= 1, 'Debe devolver al menos 1 proyecto');
    const p3 = data.find((p) => p.id === 3);
    assert.ok(p3, 'El proyecto con id 3 debe estar en la lista');
    assert.strictEqual(p3.projectNumber, 3);
    assert.strictEqual(p3.phoneModel, 'Samsung Galaxy A03');
    assert.strictEqual(p3.status, 'PENDING');
    assert.strictEqual(p3.estimatedProfit, 25000);
    assert.strictEqual(p3.diagnosis, 'Módulo: Módulo roto, Tapa trasera: Tapa dañada');
    console.log(`   -> ${base}/api/v1/projects: OK (status 200, UTF-8 OK)`);
  }
  console.log();

  // 3. Verificación de Spring Boot: GET /api/v1/projects/3 (Detalle)
  console.log('3. [Spring Boot] Probando GET /api/v1/projects/3...');
  const detailRes = await fetch(`${API_BASE}/api/v1/projects/3`, {
    headers: { Accept: 'application/json' }
  });
  assert.strictEqual(detailRes.status, 200, 'Detalle debe devolver 200');
  const detail = await detailRes.json();
  assert.strictEqual(detail.id, 3);
  assert.strictEqual(detail.phoneModel, 'Samsung Galaxy A03');
  assert.strictEqual(detail.status, 'PENDING');
  assert.ok(Array.isArray(detail.diagnosis), 'diagnosis debe ser una colección');
  assert.strictEqual(detail.diagnosis.length, 2, 'Debe contener 2 fallas');
  assert.strictEqual(detail.diagnosis[0].componentName, 'Módulo');
  assert.strictEqual(detail.diagnosis[1].componentName, 'Tapa trasera');
  console.log('   -> Detalle recibido correctamente con fallas estructuradas: OK\n');

  // 4. Verificación de Spring Boot: GET /api/v1/projects/3/images
  console.log('4. [Spring Boot] Probando GET /api/v1/projects/3/images...');
  const imagesRes = await fetch(`${API_BASE}/api/v1/projects/3/images`);
  assert.strictEqual(imagesRes.status, 200, 'Images debe responder 200');
  const images = await imagesRes.json();
  assert.ok(Array.isArray(images), 'Debe devolver un array de imágenes');
  assert.strictEqual(images.length, 1);
  assert.ok(images[0].url.startsWith('/uploads/'));
  console.log('   -> Imágenes asociadas recibidas: OK\n');

  // 5. Verificación de descarga de imagen estática
  console.log('5. [Spring Boot Storage] Probando GET del archivo estático de imagen...');
  const imgFileRes = await fetch(`${API_BASE}${images[0].url}`);
  assert.strictEqual(imgFileRes.status, 200, 'La imagen estática debe responder 200');
  const contentType = imgFileRes.headers.get('content-type');
  assert.ok(contentType?.includes('image/jpeg'), 'Content-Type debe ser image/jpeg');
  const imgBuffer = await imgFileRes.arrayBuffer();
  assert.strictEqual(imgBuffer.byteLength, 42199, 'El tamaño del archivo debe coincidir');
  console.log(`   -> Imagen descargada con éxito (${imgBuffer.byteLength} bytes): OK\n`);

  // 6. Verificación de manejo de errores (404)
  console.log('6. [Spring Boot / Frontend Error Handling] Probando id inexistente (404)...');
  const notFoundRes = await fetch(`${API_BASE}/api/v1/projects/999`);
  assert.strictEqual(notFoundRes.status, 404, 'Debe devolver 404');
  const problem = await notFoundRes.json();
  assert.ok(problem.detail?.includes('999'), 'Problem detail debe incluir el id');
  console.log(`   -> Respuesta de error RFC 7807: ${problem.detail}: OK\n`);

  // 7. Verificación de CORS Preflight (OPTIONS)
  console.log('7. [Spring Boot CORS] Probando preflight OPTIONS...');
  const corsRes = await fetch(`${API_BASE}/api/v1/projects`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:8081',
      'Access-Control-Request-Method': 'GET',
    }
  });
  const allowOrigin = corsRes.headers.get('access-control-allow-origin');
  assert.strictEqual(allowOrigin, '*', 'Debe permitir CORS');
  console.log('   Allow-Origin recibido:', allowOrigin);
  console.log('   -> CORS verificado: OK\n');

  console.log('====================================================');
  console.log('TODAS LAS PRUEBAS DE INTEGRACIÓN SE COMPLETARON CON ÉXITO');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('ERROR EN PRUEBAS:', err);
  process.exit(1);
});

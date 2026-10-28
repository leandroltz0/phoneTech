-- ==============================================================================
-- Tabla: public.phone_models
-- Script para crear la tabla y sembrar/actualizar los modelos con la imagen
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.phone_models (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    commercial_name VARCHAR(150) NOT NULL,
    image_uri TEXT NULL,
    unlocktool_status VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN' 
        CHECK (unlocktool_status IN ('SUPPORTED', 'UNSUPPORTED', 'UNKNOWN')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (brand, commercial_name)
);

CREATE INDEX IF NOT EXISTS idx_phone_models_is_active ON public.phone_models(is_active);

-- 1. Si ya tenés registros creados y querés asignar la imagen a todos:
UPDATE public.phone_models
SET image_uri = '/uploads/default-device.jpeg',
    updated_at = CURRENT_TIMESTAMP;

-- 2. Insertar o actualizar el catálogo completo de modelos con imagen y estado de UnlockTool:
INSERT INTO public.phone_models (brand, commercial_name, image_uri, unlocktool_status, is_active)
VALUES
  ('Samsung', 'Galaxy A03', '/uploads/default-device.jpeg', 'SUPPORTED', TRUE),
  ('Samsung', 'Galaxy A10', '/uploads/default-device.jpeg', 'SUPPORTED', TRUE),
  ('Samsung', 'Galaxy A14', '/uploads/default-device.jpeg', 'UNSUPPORTED', TRUE),
  ('Motorola', 'Moto E13', '/uploads/default-device.jpeg', 'UNSUPPORTED', TRUE),
  ('Samsung', 'Galaxy A04', '/uploads/default-device.jpeg', 'SUPPORTED', TRUE),
  ('Motorola', 'Moto G22', '/uploads/default-device.jpeg', 'UNSUPPORTED', TRUE),
  ('Samsung', 'Galaxy A12', '/uploads/default-device.jpeg', 'SUPPORTED', TRUE),
  ('Motorola', 'Moto G32', '/uploads/default-device.jpeg', 'UNSUPPORTED', TRUE)
ON CONFLICT (brand, commercial_name)
DO UPDATE SET
  image_uri = EXCLUDED.image_uri,
  unlocktool_status = EXCLUDED.unlocktool_status,
  updated_at = CURRENT_TIMESTAMP;

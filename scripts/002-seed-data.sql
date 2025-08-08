-- Insert sample user (password is 'password123' hashed)
INSERT INTO users (name, email, password_hash) VALUES 
('Admin User', 'admin@crm.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;

-- Get the user ID for sample data
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    SELECT id INTO sample_user_id FROM users WHERE email = 'admin@crm.com';
    
    -- Insert sample properties
    INSERT INTO properties (title, description, address, price, type, status, user_id) VALUES 
    ('Apartamento 3 quartos Itaim Bibi', 'Apartamento moderno com 3 quartos, 2 banheiros e varanda', 'Rua Joaquim Floriano, 1000 - Itaim Bibi, São Paulo', 850000.00, 'Apartamento', 'Disponível', sample_user_id),
    ('Casa 4 quartos Vila Madalena', 'Casa térrea com quintal e garagem para 2 carros', 'Rua Harmonia, 500 - Vila Madalena, São Paulo', 1200000.00, 'Casa', 'Disponível', sample_user_id),
    ('Cobertura Jardins', 'Cobertura duplex com terraço e piscina', 'Alameda Santos, 2000 - Jardins, São Paulo', 2500000.00, 'Cobertura', 'Reservado', sample_user_id)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample clients
    INSERT INTO clients (full_name, phone, email, funnel_status, notes, user_id) VALUES 
    ('João Silva', '11999887766', 'joao@email.com', 'Contato', 'Cliente interessado em apartamento no Itaim', sample_user_id),
    ('Maria Santos', '11988776655', 'maria@email.com', 'Diagnóstico', 'Procura casa com quintal, orçamento até 1.5M', sample_user_id),
    ('Pedro Oliveira', '11977665544', 'pedro@email.com', 'Agendado', 'Visita agendada para sábado às 14h', sample_user_id),
    ('Ana Costa', '11966554433', 'ana@email.com', 'Visitado', 'Gostou do apartamento, aguardando proposta', sample_user_id),
    ('Carlos Ferreira', '11955443322', 'carlos@email.com', 'Proposta', 'Proposta enviada, aguardando resposta', sample_user_id)
    ON CONFLICT DO NOTHING;
END $$;

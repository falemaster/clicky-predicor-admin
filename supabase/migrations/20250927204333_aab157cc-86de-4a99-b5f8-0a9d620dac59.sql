-- Populate admin_users with test data
INSERT INTO admin_users (email, first_name, last_name, total_searches, is_active, last_login) VALUES
('admin@example.com', 'Admin', 'User', 45, true, now() - interval '2 hours'),
('john.doe@example.com', 'John', 'Doe', 23, true, now() - interval '1 day'),
('jane.smith@example.com', 'Jane', 'Smith', 67, true, now() - interval '3 hours'),
('marc.martin@example.com', 'Marc', 'Martin', 12, false, now() - interval '1 week'),
('sophie.bernard@example.com', 'Sophie', 'Bernard', 34, true, now() - interval '5 hours');

-- Populate admin_companies with test data based on existing search history
INSERT INTO admin_companies (company_name, siren, siret, naf_code, activity, address, city, postal_code, status, search_count, last_searched) VALUES
('EXEMPLE SARL', '123456789', '12345678900001', '6201Z', 'Programmation informatique', '123 Rue de la Tech', 'Paris', '75001', 'active', 15, now() - interval '2 hours'),
('INNOVATION SAS', '987654321', '98765432100001', '7022Z', 'Conseil pour les affaires', '456 Avenue Innovation', 'Lyon', '69001', 'active', 12, now() - interval '1 day'),
('FINANCE CORP', '456789123', '45678912300001', '6419Z', 'Autres intermédiations monétaires', '789 Boulevard Finance', 'Marseille', '13001', 'active', 8, now() - interval '3 hours'),
('TECH STARTUP', '789123456', '78912345600001', '6201Z', 'Programmation informatique', '321 Rue Startup', 'Toulouse', '31000', 'active', 25, now() - interval '4 hours'),
('CONSULTING GROUP', '654321987', '65432198700001', '7022Z', 'Conseil pour les affaires', '654 Place Consulting', 'Nice', '06000', 'active', 18, now() - interval '6 hours');

-- Add some sample analytics data
INSERT INTO admin_analytics (date, total_searches, unique_users, registered_users, anonymous_searches, api_calls) VALUES
(CURRENT_DATE, 131, 5, 5, 0, 245),
(CURRENT_DATE - 1, 89, 4, 4, 12, 178),
(CURRENT_DATE - 2, 76, 3, 3, 8, 156),
(CURRENT_DATE - 3, 92, 5, 5, 15, 201),
(CURRENT_DATE - 4, 67, 3, 3, 5, 134),
(CURRENT_DATE - 5, 103, 4, 4, 18, 223),
(CURRENT_DATE - 6, 88, 3, 3, 10, 189);
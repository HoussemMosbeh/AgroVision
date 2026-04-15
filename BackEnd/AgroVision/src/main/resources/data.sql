INSERT INTO plante (nom_plante, type_plante, description) VALUES
('Pomme', 'Fruit', 'Pomme'),
('Peche', 'Fruit', 'Pêche'),
('Mais', 'Céréale', 'Maïs'),
('Raisin', 'Fruit', 'Raisin')
ON CONFLICT (nom_plante) DO NOTHING;
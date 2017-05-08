-- noinspection SqlNoDataSourceInspectionForFile

INSERT INTO property_type (label) VALUES ('APARTMENT'), ('HOUSE'), ('LAND');
INSERT INTO contact_type (label) VALUES ('CUSTOMER'), ('OWNER');
INSERT INTO property_contract (label) VALUES ('RENT'), ('SELL');
INSERT INTO owner_type (label) VALUES ('INDIVIDUAL'), ('COMPANY'); -- particulier

INSERT INTO size_unit VALUES (1, 'm²'), (2, 'ha');

--- Customer 1

INSERT INTO contact_info (phone) VALUES ('0022373034603');

INSERT INTO contact (first_name, last_name) VALUES ('Seydou', 'Niang');


INSERT INTO contact_contact_info VALUES (1,1);
INSERT INTO contact_contact_type VALUES (1,1);
;
INSERT INTO customer (name, reference) VALUES ('AIA-Mali SARL','00001');
INSERT INTO customer_contact VALUES (1,1);


INSERT INTO login (login, password, enabled) VALUES ('seydou.niang','dnaqr7AnyCW9mrq3iyNAcOcCdS9iW3UuVeVbSOYH41g=','1');
INSERT INTO contact_login VALUES (1,1);

INSERT INTO contact_info (phone) VALUES ('0022373034604');
INSERT INTO contact_info (phone) VALUES ('0022373034605');

INSERT INTO contact (first_name, last_name) VALUES ('Mamadou', 'Diarra');
INSERT INTO contact (first_name, last_name) VALUES ('Ousmane', 'Drame');

INSERT INTO contact_contact_info VALUES (2,2);
INSERT INTO contact_contact_type VALUES (2,3);

INSERT INTO owner (reference, type_id) VALUES ('00001', 1), ('00002', 1), ('00003', 2);
INSERT INTO owner_contact (owner_id, contact_id) VALUES (1, 2), (2, 3);
INSERT INTO owner_company_name (owner_id, name) VALUES (3, 'Kone Immobilier SA');

INSERT INTO customer_owner VALUES  (1,1), (2,1), (3,1);

INSERT INTO location (country, district, city) VALUES
  ('Mali', 'Bamako', 'Bamako'),
  ('Mali', 'Sikasso', 'Sikasso'),
  ('Mali', 'Mopti', 'Mopti'),
  ('Mali', 'Sikasso', 'Koutiala'),
  ('Mali', 'Kayes', 'Kayes'),
  ('Mali', 'Ségou', 'Ségou'),
  ('Mali', 'Kayes', 'Nioro du Sahel'),
  ('Mali', 'Ségou', 'Niono'),
  ('Mali', 'Ségou', 'Markala'),
  ('Mali', 'Ségou', 'Kolondiéba'),
  ('Mali', 'Koulikoro', 'Kati'),
  ('Mali', 'Gao', 'Gao'),
  ('Mali', 'Koulikoro', 'Kolokani'),
  ('Mali', 'Gao', 'Ménaka'),
  ('Mali', 'Sikasso', 'Bougouni'),
  ('Mali', 'Tombouctou', 'Niafunké'),
  ('Mali', 'Koulikoro', 'Banamba'),
  ('Mali', 'Ségou', 'Macina'),
  ('Mali', 'Koulikoro', 'Nara'),
  ('Mali', 'Kayes', 'Bafoulabé'),
  ('Mali', 'Ségou', 'San'),
  ('Mali', 'Koulikoro', 'Koulikoro'),
  ('Mali', 'Mopti', 'Djenné'),
  ('Mali', 'Ségou', 'Sokolo'),
  ('Mali', 'Sikasso', 'Yorosso'),
  ('Mali', 'Koulikoro', 'Kangaba'),
  ('Mali', 'Kidal', 'Kidal'),
  ('Mali', 'Tombouctou', 'Diré'),
  ('Mali', 'Tombouctou', 'Goundam'),
  ('Mali', 'Mopti', 'Douentza'),
  ('Mali', 'Mopti', 'Ténenkou'),
  ('Mali', 'Mopti', 'Bandiagara'),
  ('Mali', 'Ségou', 'Kimparana'),
  ('Mali', 'Kayes', 'Kita'),
  ('Mali', 'Araouane', 'Tombouctou'),
  ('Mali', 'Taoudeni', 'Tombouctou'),
  ('Mali', 'Kidal', 'Tessalit');

INSERT INTO neighborhood (name, location_id) VALUES
  -- Quartiers de Bamako
  -- Commune 1 : 9 quartiers
  ('Banconi', 1), ('Boulkassombougou', 1), ('Djélibougou', 1), ('Doumanzana', 1), ('Fadjiguila', 1), ('Sotuba', 1), ('Korofina Nord', 1),
  ('Korofina Sud', 1), ('Sikoroni', 1),
  -- Commune 2: 11 quartiers
  ('Niaréla', 1), ('Bagadadji', 1), ('Médina-coura', 1), ('Bozola', 1), ('Missira', 1), ('Hippodrome', 1), ('Quinzambougou', 1),
  ('Bakaribougou', 1), ('TSF', 1), ('Zone industrielle', 1), ('Bougouba', 1),
  -- Commune 3?
  -- Commune 4: 8 quartiers
  ('Taliko', 1), ('Lassa', 1), ('Sibiribougou', 1), ('Djikoroni-Para', 1), ('Sébénikoro', 1), ('Hamdallaye', 1), ('Lafiabougou', 1),
  ('Kalabambougou', 1),
  -- Commune 5: 8 quartiers
  ('Badalabougou', 1), ('Sema I', 1), ('Quartier Mali', 1), ('Torokorobougou', 1), ('Baco-Djicoroni', 1), ('Sabalibougou', 1), ('Daoudabougou', 1),
  ('Kalaban-Coura', 1),
  -- Commune 6: 8 quartiers
  ('Banankabougou', 1), ('Djanékéla', 1), ('Faladié', 1), ('Magnambougou', 1), ('Missabougou', 1), ('Niamakoro', 1), ('Sénou', 1),
  ('Sogoniko', 1), ('Sokorodji', 1), ('Yirimadio', 1);

-- Properties
/*
INSERT INTO Property (name, reference, type_id) VALUES
  ('Bel appart dans grand immeuble', '0001', 1),
  ('Villa luxeuse avec piscine', '0002', 1),
  ('Grand duplex en bord de fleuve', '0003', 1),
  ('2 pièces meublé au calme', '0004', 2),
  ('Terrain de 1ha à Nyamana', '0005', 3);


INSERT INTO property_location (property_id, location_id) VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1),
  (5, 1);

INSERT INTO property_property_contract (property_id, property_contract_id) VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1),
  (5, 2);

INSERT INTO owner_property VALUES
  (1, 1),
  (1, 2),
  (2, 3),
  (1, 4),
  (2, 5);
  */

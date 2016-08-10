-- noinspection SqlNoDataSourceInspectionForFile

INSERT INTO property_type (label) VALUES ('APARTMENT'), ('HOUSE'), ('LAND');
INSERT INTO contact_type (label) VALUES ('CUSTOMER'), ('OWNER');
INSERT INTO property_contract (label) VALUES ('RENT'), ('SELL');
INSERT INTO owner_type (label) VALUES ('INDIVIDUAL'), ('COMPANY'); -- particulier



--- Customer 1

INSERT INTO contact_info (email) VALUES
('seydou.niang@aia-mali.com');

INSERT INTO contact (first_name, last_name, contact_info_id, contact_type_id) VALUES
('Seydou', 'Niang', 1, 1);

INSERT INTO customer (name, reference) VALUES ('AIA-Mali SARL','00001');
INSERT INTO customer_contact VALUES (1,1);


INSERT INTO login (login, password, enabled) VALUES ('seydou.niang','dnaqr7AnyCW9mrq3iyNAcOcCdS9iW3UuVeVbSOYH41g=','1');
INSERT INTO contact_login VALUES (1,1);

INSERT INTO contact_info (email) VALUES ('mamadou.diarra@gmail.com');
INSERT INTO contact_info (email) VALUES ('ousmane.drame@gmail.com');

INSERT INTO contact (first_name, last_name, contact_info_id, contact_type_id) VALUES ('Mamadou', 'Diarra', 2, 2);
INSERT INTO contact (first_name, last_name, contact_info_id, contact_type_id) VALUES ('Ousmane', 'Drame', 2, 2);


INSERT INTO owner (reference, type_id) VALUES ('00001', 1), ('00002', 1), ('00003', 2);
INSERT INTO owner_contact (owner_id, contact_id) VALUES (1, 2), (2, 3);
INSERT INTO owner_name (owner_id, name) VALUES (3, 'Kone Immobilier SA');

INSERT INTO customer_owner VALUES  (1,1), (2,1), (3,1);


-- Properties
INSERT INTO Property (name, reference, type_id) VALUES
  ('Sokorodji 1', '0001', 1),
  ('Badalabougou', '0002', 1),
  ('Sogoniko', '0003', 1),
  ('Hamdalaye', '0004', 2),
  ('Point G', '0005', 3);

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
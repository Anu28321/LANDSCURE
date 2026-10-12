USE landsure;

-- Sample users
INSERT INTO users (name, email, password, role)
VALUES
('Test Owner', 'owner@test.com', 'demo_password', 'owner'),
('Test Buyer', 'buyer@test.com', 'demo_password', 'buyer');

-- Sample land
INSERT INTO lands
(owner_id, land_name, location, area, price, survey_number, description)
VALUES
(1, 'Green Valley Land', 'Trichy, Tamil Nadu', 2.00, 3500000,
 'SUR1001', '2-acre land with road access');

-- Sample document
INSERT INTO documents
(land_id, document_name, document_path, verification_status)
VALUES
(1, 'Land Ownership Document', 'uploads/sample_land.pdf', 'pending');

-- Sample verification result
INSERT INTO verification_results
(document_id, owner_match, survey_match, location_match,
 area_match, overall_status, remarks)
VALUES
(1, 1, 1, 1, 1, 'verified', 'Sample test record only');

-- Sample purchase request
INSERT INTO purchase_requests
(buyer_id, owner_id, land_id, status)
VALUES
(2, 1, 1, 'pending');
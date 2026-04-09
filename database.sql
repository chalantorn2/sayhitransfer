-- ============================================================
-- SayHi Transfer Database Schema
-- Database: samui_sayhitransfer
-- ============================================================

CREATE DATABASE IF NOT EXISTS `samui_sayhitransfer`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `samui_sayhitransfer`;

-- ------------------------------------------------------------
-- Locations (pick-up / drop-off points)
-- ------------------------------------------------------------
CREATE TABLE `locations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('airport','hotel-area','pier','attraction') NOT NULL,
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Vehicles
-- ------------------------------------------------------------
CREATE TABLE `vehicles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255),
  `max_passengers` INT NOT NULL,
  `max_luggage` INT NOT NULL,
  `base_price` DECIMAL(10,2) NOT NULL,
  `image_url` VARCHAR(500),
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Route Pricing (price per route per vehicle)
-- ------------------------------------------------------------
CREATE TABLE `route_prices` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `pickup_location_id` INT UNSIGNED NOT NULL,
  `dropoff_location_id` INT UNSIGNED NOT NULL,
  `vehicle_id` INT UNSIGNED NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `route_vehicle` (`pickup_location_id`, `dropoff_location_id`, `vehicle_id`),
  FOREIGN KEY (`pickup_location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`dropoff_location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tours
-- ------------------------------------------------------------
CREATE TABLE `tours` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `description` TEXT,
  `highlights` JSON,
  `schedule` JSON,
  `included` JSON,
  `not_included` JSON,
  `image_url` VARCHAR(500),
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Transfer Bookings
-- ------------------------------------------------------------
CREATE TABLE `bookings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `booking_ref` VARCHAR(50) NOT NULL UNIQUE,
  `trip_type` ENUM('oneway','return') NOT NULL,
  `pickup_location_id` INT UNSIGNED NOT NULL,
  `dropoff_location_id` INT UNSIGNED NOT NULL,
  `pickup_date` DATE NOT NULL,
  `pickup_time` TIME NOT NULL,
  `return_date` DATE,
  `return_time` TIME,
  `adults` INT NOT NULL DEFAULT 1,
  `children` INT NOT NULL DEFAULT 0,
  `infants` INT NOT NULL DEFAULT 0,
  `vehicle_id` INT UNSIGNED NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `line_id` VARCHAR(100),
  `flight_number` VARCHAR(50),
  `special_requests` TEXT,
  `status` ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`pickup_location_id`) REFERENCES `locations`(`id`),
  FOREIGN KEY (`dropoff_location_id`) REFERENCES `locations`(`id`),
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`)
) ENGINE=InnoDB;

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Locations
INSERT INTO `locations` (`name`, `type`, `sort_order`) VALUES
-- Airports
('Samui Airport (USM)', 'airport', 1),
('Surat Thani Airport (URT)', 'airport', 2),
('Nakhon Si Thammarat Airport (NST)', 'airport', 3),
-- Piers
('Nathon Pier', 'pier', 10),
('Lipa Noi Pier', 'pier', 11),
('Big Buddha Pier (Bangrak)', 'pier', 12),
('Donsak Pier', 'pier', 13),
-- Hotel Areas - Koh Samui
('Chaweng Beach Area', 'hotel-area', 20),
('Lamai Beach Area', 'hotel-area', 21),
('Bophut / Fisherman Village', 'hotel-area', 22),
('Maenam Beach Area', 'hotel-area', 23),
('Lipa Noi / Taling Ngam Area', 'hotel-area', 24),
('Choeng Mon Beach Area', 'hotel-area', 25),
('Hua Thanon Area', 'hotel-area', 26),
-- Attractions
('Ang Thong National Marine Park', 'attraction', 30),
('Koh Phangan', 'attraction', 31),
('Koh Tao', 'attraction', 32);

-- Vehicles
INSERT INTO `vehicles` (`name`, `description`, `max_passengers`, `max_luggage`, `base_price`, `sort_order`) VALUES
('Economy Sedan', 'Toyota Vios or similar', 3, 2, 800.00, 1),
('Premium Sedan', 'Toyota Camry or similar', 3, 3, 1200.00, 2),
('SUV', 'Toyota Fortuner or similar', 5, 4, 1500.00, 3),
('Minivan', 'Toyota Commuter or similar', 10, 8, 1800.00, 4),
('VIP Van', 'Toyota Alphard or similar', 6, 6, 2500.00, 5);

-- Route Prices (Samui Airport to various destinations)
INSERT INTO `route_prices` (`pickup_location_id`, `dropoff_location_id`, `vehicle_id`, `price`) VALUES
-- Samui Airport → Chaweng
(1, 8, 1, 600.00), (1, 8, 2, 900.00), (1, 8, 3, 1100.00), (1, 8, 4, 1400.00), (1, 8, 5, 2000.00),
-- Samui Airport → Lamai
(1, 9, 1, 800.00), (1, 9, 2, 1100.00), (1, 9, 3, 1300.00), (1, 9, 4, 1600.00), (1, 9, 5, 2200.00),
-- Samui Airport → Bophut
(1, 10, 1, 500.00), (1, 10, 2, 800.00), (1, 10, 3, 1000.00), (1, 10, 4, 1300.00), (1, 10, 5, 1800.00),
-- Samui Airport → Maenam
(1, 11, 1, 700.00), (1, 11, 2, 1000.00), (1, 11, 3, 1200.00), (1, 11, 4, 1500.00), (1, 11, 5, 2100.00),
-- Samui Airport → Lipa Noi
(1, 12, 1, 900.00), (1, 12, 2, 1200.00), (1, 12, 3, 1400.00), (1, 12, 4, 1700.00), (1, 12, 5, 2400.00),
-- Samui Airport → Choeng Mon
(1, 13, 1, 500.00), (1, 13, 2, 800.00), (1, 13, 3, 1000.00), (1, 13, 4, 1300.00), (1, 13, 5, 1800.00),
-- Samui Airport → Nathon Pier
(1, 4, 1, 800.00), (1, 4, 2, 1100.00), (1, 4, 3, 1300.00), (1, 4, 4, 1600.00), (1, 4, 5, 2200.00),
-- Samui Airport → Big Buddha Pier
(1, 6, 1, 400.00), (1, 6, 2, 700.00), (1, 6, 3, 900.00), (1, 6, 4, 1200.00), (1, 6, 5, 1700.00),
-- Nathon Pier → Chaweng
(4, 8, 1, 700.00), (4, 8, 2, 1000.00), (4, 8, 3, 1200.00), (4, 8, 4, 1500.00), (4, 8, 5, 2100.00),
-- Nathon Pier → Lamai
(4, 9, 1, 800.00), (4, 9, 2, 1100.00), (4, 9, 3, 1300.00), (4, 9, 4, 1600.00), (4, 9, 5, 2200.00),
-- Nathon Pier → Bophut
(4, 10, 1, 600.00), (4, 10, 2, 900.00), (4, 10, 3, 1100.00), (4, 10, 4, 1400.00), (4, 10, 5, 2000.00),
-- Chaweng → Lamai
(8, 9, 1, 500.00), (8, 9, 2, 800.00), (8, 9, 3, 1000.00), (8, 9, 4, 1300.00), (8, 9, 5, 1800.00),
-- Chaweng → Bophut
(8, 10, 1, 400.00), (8, 10, 2, 700.00), (8, 10, 3, 900.00), (8, 10, 4, 1200.00), (8, 10, 5, 1700.00);

-- Tours
INSERT INTO `tours` (`name`, `province`, `price`, `description`, `highlights`, `schedule`, `included`, `not_included`, `sort_order`) VALUES
(
  'Ang Thong National Marine Park',
  'Surat Thani',
  1900.00,
  'Discover the breathtaking Ang Thong National Marine Park — a stunning archipelago of 42 islands with emerald lagoons, limestone cliffs, and pristine beaches. Kayak through hidden caves, snorkel in crystal-clear waters, and hike to panoramic viewpoints.',
  '["42 Islands","Emerald Lagoon","Kayaking","Snorkeling"]',
  '[{"time":"07:00","activity":"Pick up from hotel"},{"time":"08:30","activity":"Depart from Nathon Pier"},{"time":"10:00","activity":"Arrive at Ang Thong"},{"time":"10:30","activity":"Kayaking & Emerald Lagoon"},{"time":"12:00","activity":"Lunch on the boat"},{"time":"13:00","activity":"Hiking to viewpoint"},{"time":"14:30","activity":"Snorkeling & swimming"},{"time":"15:30","activity":"Depart back"},{"time":"17:30","activity":"Transfer to hotel"}]',
  '["Round-trip boat transfer","Thai buffet lunch","Kayak & snorkeling gear","English-speaking guide","National park fee","Travel insurance"]',
  '["Personal expenses","Tips","Alcoholic beverages"]',
  1
),
(
  'Koh Tao & Koh Nang Yuan Snorkeling Trip',
  'Surat Thani',
  2200.00,
  'Cruise to the famous Koh Tao and Koh Nang Yuan islands for a full day of world-class snorkeling. Explore vibrant coral reefs, swim with tropical fish, and relax on the iconic sandbar connecting three islands.',
  '["Koh Nang Yuan","Coral reefs","Tropical fish","Viewpoint hike"]',
  '[{"time":"06:30","activity":"Pick up from hotel"},{"time":"07:30","activity":"Depart from pier"},{"time":"09:30","activity":"Arrive at Koh Nang Yuan"},{"time":"10:00","activity":"Hike to viewpoint"},{"time":"11:00","activity":"Snorkeling at Japanese Garden"},{"time":"12:30","activity":"Lunch at Koh Tao"},{"time":"14:00","activity":"Snorkeling at Mango Bay"},{"time":"15:30","activity":"Free time on the beach"},{"time":"16:00","activity":"Depart back"},{"time":"18:00","activity":"Transfer to hotel"}]',
  '["Speedboat transfer","Lunch","Snorkeling equipment","Guide","National park fee","Insurance"]',
  '["Personal expenses","Tips","Underwater camera rental","Koh Nang Yuan entrance fee (if separate)"]',
  2
),
(
  'Koh Phangan Day Trip',
  'Surat Thani',
  1500.00,
  'Explore the beautiful Koh Phangan beyond the Full Moon Party. Visit pristine beaches, sacred temples, and a stunning waterfall. Enjoy snorkeling at secluded spots and a delicious Thai lunch by the sea.',
  '["Thong Nai Pan Beach","Phaeng Waterfall","Snorkeling","Temple visit"]',
  '[{"time":"08:00","activity":"Pick up from hotel"},{"time":"09:00","activity":"Ferry to Koh Phangan"},{"time":"10:00","activity":"Visit Wat Phu Khao Noi"},{"time":"11:00","activity":"Phaeng Waterfall"},{"time":"12:00","activity":"Lunch at Thong Nai Pan"},{"time":"13:30","activity":"Snorkeling"},{"time":"15:00","activity":"Beach free time"},{"time":"16:00","activity":"Ferry back to Samui"},{"time":"17:00","activity":"Transfer to hotel"}]',
  '["Round-trip ferry","Thai lunch","Snorkeling gear","Guide","Insurance"]',
  '["Personal expenses","Tips","National park fee (200 THB)"]',
  3
),
(
  'Samui Island Safari & Elephant Sanctuary',
  'Surat Thani',
  2000.00,
  'Experience the wild side of Koh Samui with a 4x4 safari adventure. Visit an ethical elephant sanctuary, trek through the jungle, enjoy a coconut show, and take in panoramic island views.',
  '["Elephant sanctuary","4x4 Safari","Coconut show","Jungle trek"]',
  '[{"time":"08:30","activity":"Pick up from hotel"},{"time":"09:30","activity":"Elephant sanctuary visit"},{"time":"11:00","activity":"4x4 jungle safari"},{"time":"12:00","activity":"Lunch at mountain viewpoint"},{"time":"13:30","activity":"Coconut show & rubber plantation"},{"time":"14:30","activity":"Na Muang Waterfall"},{"time":"15:30","activity":"Secret Buddha Garden"},{"time":"16:30","activity":"Transfer to hotel"}]',
  '["Round-trip transfer","Thai lunch","Sanctuary entrance","4x4 vehicle","Guide","Insurance"]',
  '["Personal expenses","Tips","Professional photos"]',
  4
),
(
  'Koh Madsum & Koh Tan Snorkeling',
  'Surat Thani',
  1200.00,
  'Escape to the tranquil islands of Koh Madsum (Pig Island) and Koh Tan, just south of Samui. Enjoy pristine beaches, meet the friendly pigs, snorkel over coral reefs, and relax in paradise.',
  '["Pig Island","Koh Tan corals","Pristine beaches","Longtail boat"]',
  '[{"time":"09:30","activity":"Pick up from hotel"},{"time":"10:30","activity":"Depart from Thong Krut Pier"},{"time":"11:00","activity":"Koh Madsum — meet the pigs!"},{"time":"12:00","activity":"Lunch on the beach"},{"time":"13:00","activity":"Koh Tan snorkeling"},{"time":"14:30","activity":"Relax on Koh Tan beach"},{"time":"15:30","activity":"Depart back"},{"time":"16:30","activity":"Transfer to hotel"}]',
  '["Longtail boat","Thai lunch box","Snorkeling gear","Guide","Insurance"]',
  '["Personal expenses","Tips","Drinks"]',
  5
),
(
  'Sunset Dinner Cruise',
  'Surat Thani',
  2800.00,
  'Sail into the golden Samui sunset aboard a traditional red Chinese junk boat. Enjoy a gourmet dinner, cocktails, and live music as the sun dips below the horizon over the Gulf of Thailand.',
  '["Sunset sailing","Gourmet dinner","Cocktails","Live music"]',
  '[{"time":"16:00","activity":"Pick up from hotel"},{"time":"16:30","activity":"Board the boat at Bangrak Pier"},{"time":"17:00","activity":"Set sail & welcome drinks"},{"time":"17:30","activity":"Snorkeling stop (optional)"},{"time":"18:30","activity":"Sunset viewing & cocktails"},{"time":"19:00","activity":"Gourmet dinner served"},{"time":"20:00","activity":"Live music & dessert"},{"time":"20:30","activity":"Return to pier"},{"time":"21:00","activity":"Transfer to hotel"}]',
  '["Round-trip transfer","Welcome cocktail","3-course dinner","Wine & drinks","Live entertainment","Insurance"]',
  '["Personal expenses","Tips","Extra premium spirits"]',
  6
);

-- ============================================================
-- Migration: Add coordinates + hotel fields for Google Places
-- Date: 2026-04-21
-- Purpose: Customer picks real hotel via Google Places → system
--          matches it to nearest zone using lat/lng
-- ============================================================

START TRANSACTION;

-- ── 1. Add lat/lng + service radius to locations (zones) ────
ALTER TABLE `locations`
  ADD COLUMN `latitude`  DECIMAL(10, 7) DEFAULT NULL AFTER `type`,
  ADD COLUMN `longitude` DECIMAL(10, 7) DEFAULT NULL AFTER `latitude`;

-- ── 2. Seed coordinates for all 42 zones ────────────────────
-- Coords are approximate centers of each zone.
-- Admin can refine later via phpMyAdmin.

UPDATE `locations` SET latitude = 8.0986,  longitude = 98.9862  WHERE id = 1;   -- Krabi Airport
UPDATE `locations` SET latitude = 9.5479,  longitude = 100.0624 WHERE id = 2;   -- Koh Samui Airport
UPDATE `locations` SET latitude = 8.1132,  longitude = 98.3169  WHERE id = 3;   -- Phuket Airport
UPDATE `locations` SET latitude = 8.0361,  longitude = 98.8431  WHERE id = 4;   -- Ao Nammao Pier
UPDATE `locations` SET latitude = 8.0556,  longitude = 98.4028  WHERE id = 5;   -- Ao Po Pier
UPDATE `locations` SET latitude = 8.0863,  longitude = 98.9063  WHERE id = 6;   -- Krabi City Centre
UPDATE `locations` SET latitude = 8.0319,  longitude = 98.8214  WHERE id = 7;   -- Ao Nang / Nopparat Thara
UPDATE `locations` SET latitude = 8.0639,  longitude = 98.7361  WHERE id = 8;   -- Klong Muang
UPDATE `locations` SET latitude = 8.1069,  longitude = 98.7311  WHERE id = 9;   -- Tub Kaek
UPDATE `locations` SET latitude = 7.5000,  longitude = 99.0500  WHERE id = 10;  -- Klong Jin (Koh Lanta)
UPDATE `locations` SET latitude = 8.0319,  longitude = 98.8214  WHERE id = 11;  -- Ao Nang
UPDATE `locations` SET latitude = 9.5667,  longitude = 100.0667 WHERE id = 12;  -- Pilae Laem (Plai Laem)
UPDATE `locations` SET latitude = 9.5336,  longitude = 100.0631 WHERE id = 13;  -- Chaweng
UPDATE `locations` SET latitude = 9.5550,  longitude = 100.0531 WHERE id = 14;  -- BangRak
UPDATE `locations` SET latitude = 9.5620,  longitude = 100.0644 WHERE id = 15;  -- Bo Phut
UPDATE `locations` SET latitude = 9.5631,  longitude = 100.0772 WHERE id = 16;  -- Choengmon
UPDATE `locations` SET latitude = 9.5392,  longitude = 100.0250 WHERE id = 17;  -- Baan Tai
UPDATE `locations` SET latitude = 9.5958,  longitude = 99.9972  WHERE id = 18;  -- Bang Por
UPDATE `locations` SET latitude = 9.4800,  longitude = 100.0500 WHERE id = 19;  -- Lamai
UPDATE `locations` SET latitude = 9.5700,  longitude = 100.0147 WHERE id = 20;  -- Mae Nam
UPDATE `locations` SET latitude = 9.4667,  longitude = 100.0500 WHERE id = 21;  -- Hua Thanon
UPDATE `locations` SET latitude = 9.4417,  longitude = 100.0667 WHERE id = 22;  -- Suan Pee Seua
UPDATE `locations` SET latitude = 9.5406,  longitude = 99.9486  WHERE id = 23;  -- Na Thon
UPDATE `locations` SET latitude = 9.5150,  longitude = 99.9544  WHERE id = 24;  -- Lipa Noi
UPDATE `locations` SET latitude = 9.4500,  longitude = 99.9667  WHERE id = 25;  -- Pang Kha
UPDATE `locations` SET latitude = 9.4328,  longitude = 99.9544  WHERE id = 26;  -- Conrad Area
UPDATE `locations` SET latitude = 9.4444,  longitude = 99.9583  WHERE id = 27;  -- Baan Taling Ngam
UPDATE `locations` SET latitude = 7.8956,  longitude = 98.2975  WHERE id = 28;  -- Patong
UPDATE `locations` SET latitude = 7.8456,  longitude = 98.2953  WHERE id = 29;  -- Karon
UPDATE `locations` SET latitude = 7.8194,  longitude = 98.3014  WHERE id = 30;  -- Kata
UPDATE `locations` SET latitude = 7.8500,  longitude = 98.2961  WHERE id = 31;  -- Patong/Kata/Karon
UPDATE `locations` SET latitude = 7.7786,  longitude = 98.3250  WHERE id = 32;  -- Rawai
UPDATE `locations` SET latitude = 7.7739,  longitude = 98.3056  WHERE id = 33;  -- Nai Harn
UPDATE `locations` SET latitude = 7.8472,  longitude = 98.3367  WHERE id = 34;  -- Chalong
UPDATE `locations` SET latitude = 7.8083,  longitude = 98.4042  WHERE id = 35;  -- Cape Panwa
UPDATE `locations` SET latitude = 8.0861,  longitude = 98.3028  WHERE id = 36;  -- Nai Yang
UPDATE `locations` SET latitude = 8.0631,  longitude = 98.2864  WHERE id = 37;  -- Nai Thon Beach
UPDATE `locations` SET latitude = 8.1283,  longitude = 98.3050  WHERE id = 38;  -- Mai Khao
UPDATE `locations` SET latitude = 7.9111,  longitude = 98.3300  WHERE id = 39;  -- Kathu
UPDATE `locations` SET latitude = 7.9933,  longitude = 98.2944  WHERE id = 40;  -- Bang Tao
UPDATE `locations` SET latitude = 7.9717,  longitude = 98.2806  WHERE id = 41;  -- Surin
UPDATE `locations` SET latitude = 7.9508,  longitude = 98.2831  WHERE id = 42;  -- Kamala

-- ── 3. Add hotel fields to bookings ─────────────────────────
-- Captures actual hotel picked by customer (via Google Places),
-- so driver knows exact pickup/dropoff point, not just the zone.
ALTER TABLE `bookings`
  ADD COLUMN `pickup_hotel_name`    VARCHAR(255)    DEFAULT NULL AFTER `pickup_location_id`,
  ADD COLUMN `pickup_hotel_address` VARCHAR(500)    DEFAULT NULL AFTER `pickup_hotel_name`,
  ADD COLUMN `pickup_lat`           DECIMAL(10, 7)  DEFAULT NULL AFTER `pickup_hotel_address`,
  ADD COLUMN `pickup_lng`           DECIMAL(10, 7)  DEFAULT NULL AFTER `pickup_lat`,
  ADD COLUMN `dropoff_hotel_name`    VARCHAR(255)   DEFAULT NULL AFTER `dropoff_location_id`,
  ADD COLUMN `dropoff_hotel_address` VARCHAR(500)   DEFAULT NULL AFTER `dropoff_hotel_name`,
  ADD COLUMN `dropoff_lat`           DECIMAL(10, 7) DEFAULT NULL AFTER `dropoff_hotel_address`,
  ADD COLUMN `dropoff_lng`           DECIMAL(10, 7) DEFAULT NULL AFTER `dropoff_lat`;

COMMIT;

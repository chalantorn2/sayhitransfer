-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 21, 2026 at 02:20 PM
-- Server version: 10.11.14-MariaDB-0+deb12u2-log
-- PHP Version: 8.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `samui_sayhitransfer`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(10) UNSIGNED NOT NULL,
  `booking_ref` varchar(50) NOT NULL,
  `trip_type` enum('oneway','return') NOT NULL,
  `pickup_location_id` int(10) UNSIGNED NOT NULL,
  `dropoff_location_id` int(10) UNSIGNED NOT NULL,
  `pickup_date` date NOT NULL,
  `pickup_time` time NOT NULL,
  `return_date` date DEFAULT NULL,
  `return_time` time DEFAULT NULL,
  `adults` int(11) NOT NULL DEFAULT 1,
  `children` int(11) NOT NULL DEFAULT 0,
  `infants` int(11) NOT NULL DEFAULT 0,
  `vehicle_id` int(10) UNSIGNED NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `line_id` varchar(100) DEFAULT NULL,
  `flight_number` varchar(50) DEFAULT NULL,
  `special_requests` text DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('airport','hotel-area','pier','attraction') NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `type`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Krabi Airport', 'airport', 1, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(2, 'Koh Samui Airport', 'airport', 2, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(3, 'Phuket Airport', 'airport', 3, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(4, 'Ao Nammao Pier', 'pier', 10, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(5, 'Ao Po Pier', 'pier', 11, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(6, 'Krabi City Centre', 'hotel-area', 20, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(7, 'Ao Nang / Nopparat Thara', 'hotel-area', 21, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(8, 'Klong Muang', 'hotel-area', 22, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(9, 'Tub Kaek', 'hotel-area', 23, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(10, 'Klong Jin (Koh Lanta)', 'hotel-area', 24, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(11, 'Ao Nang', 'hotel-area', 25, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(12, 'Pilae Laem', 'hotel-area', 30, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(13, 'Chaweng', 'hotel-area', 31, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(14, 'BangRak', 'hotel-area', 32, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(15, 'Bo Phut', 'hotel-area', 33, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(16, 'Choengmon', 'hotel-area', 34, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(17, 'Baan Tai', 'hotel-area', 35, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(18, 'Bang Por', 'hotel-area', 36, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(19, 'Lamai', 'hotel-area', 37, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(20, 'Mae Nam', 'hotel-area', 38, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(21, 'Hua Thanon', 'hotel-area', 39, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(22, 'Suan Pee Seua', 'hotel-area', 40, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(23, 'Na Thon', 'hotel-area', 41, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(24, 'Lipa Noi', 'hotel-area', 42, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(25, 'Pang Kha', 'hotel-area', 43, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(26, 'Conrad Area', 'hotel-area', 44, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(27, 'Baan Taling Ngam Area', 'hotel-area', 45, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(28, 'Patong', 'hotel-area', 50, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(29, 'Karon', 'hotel-area', 51, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(30, 'Kata', 'hotel-area', 52, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(31, 'Patong / Kata / Karon', 'hotel-area', 53, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(32, 'Rawai', 'hotel-area', 54, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(33, 'Nai Harn', 'hotel-area', 55, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(34, 'Chalong', 'hotel-area', 56, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(35, 'Cape Panwa', 'hotel-area', 57, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(36, 'Nai Yang', 'hotel-area', 58, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(37, 'Nai Thon Beach', 'hotel-area', 59, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(38, 'Mai Khao', 'hotel-area', 60, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(39, 'Kathu', 'hotel-area', 61, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(40, 'Bang Tao', 'hotel-area', 62, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(41, 'Surin', 'hotel-area', 63, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(42, 'Kamala', 'hotel-area', 64, 1, '2026-04-19 08:31:42', '2026-04-19 08:31:42');

-- --------------------------------------------------------

--
-- Table structure for table `route_prices`
--

CREATE TABLE `route_prices` (
  `id` int(10) UNSIGNED NOT NULL,
  `pickup_location_id` int(10) UNSIGNED NOT NULL,
  `dropoff_location_id` int(10) UNSIGNED NOT NULL,
  `vehicle_id` int(10) UNSIGNED NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `route_prices`
--

INSERT INTO `route_prices` (`id`, `pickup_location_id`, `dropoff_location_id`, `vehicle_id`, `price`, `created_at`, `updated_at`) VALUES
(1, 1, 6, 1, 450.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(2, 1, 6, 3, 500.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(3, 1, 6, 4, 550.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(4, 1, 4, 1, 600.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(5, 1, 4, 3, 700.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(6, 1, 4, 4, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(7, 1, 7, 1, 600.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(8, 1, 7, 3, 700.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(9, 1, 7, 4, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(10, 1, 8, 1, 700.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(11, 1, 8, 3, 800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(12, 1, 8, 4, 900.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(13, 1, 9, 1, 800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(14, 1, 9, 3, 900.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(15, 1, 9, 4, 1000.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(16, 1, 10, 1, 2600.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(17, 1, 10, 3, 2800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(18, 1, 10, 4, 3000.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(19, 2, 12, 1, 590.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(20, 2, 12, 3, 650.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(21, 2, 12, 4, 700.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(22, 2, 13, 1, 590.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(23, 2, 13, 3, 650.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(24, 2, 13, 4, 700.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(25, 2, 14, 1, 590.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(26, 2, 14, 3, 650.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(27, 2, 14, 4, 700.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(28, 2, 15, 1, 590.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(29, 2, 15, 3, 650.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(30, 2, 15, 4, 700.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(31, 2, 16, 1, 590.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(32, 2, 16, 3, 650.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(33, 2, 16, 4, 700.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(34, 2, 17, 1, 650.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(35, 2, 17, 3, 690.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(36, 2, 17, 4, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(37, 2, 18, 1, 690.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(38, 2, 18, 3, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(39, 2, 18, 4, 800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(40, 2, 19, 1, 690.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(41, 2, 19, 3, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(42, 2, 19, 4, 800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(43, 2, 20, 1, 690.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(44, 2, 20, 3, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(45, 2, 20, 4, 800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(46, 2, 21, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(47, 2, 21, 3, 800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(48, 2, 21, 4, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(49, 2, 22, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(50, 2, 22, 3, 800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(51, 2, 22, 4, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(52, 2, 23, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(53, 2, 23, 3, 800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(54, 2, 23, 4, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(55, 2, 24, 1, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(56, 2, 24, 3, 1000.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(57, 2, 24, 4, 1050.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(58, 2, 25, 1, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(59, 2, 25, 3, 1000.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(60, 2, 25, 4, 1050.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(61, 2, 26, 1, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(62, 2, 26, 3, 1000.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(63, 2, 26, 4, 1050.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(64, 2, 27, 1, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(65, 2, 27, 3, 1000.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(66, 2, 27, 4, 1050.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(67, 11, 3, 1, 2500.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(68, 11, 3, 3, 2800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(69, 11, 3, 4, 3000.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(70, 11, 31, 1, 2800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(71, 11, 31, 3, 3000.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(72, 11, 31, 4, 2800.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(73, 3, 28, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(74, 3, 28, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(75, 3, 28, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(76, 3, 29, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(77, 3, 29, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(78, 3, 29, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(79, 3, 30, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(80, 3, 30, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(81, 3, 30, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(82, 3, 32, 1, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(83, 3, 32, 3, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(84, 3, 32, 4, 1050.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(85, 3, 33, 1, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(86, 3, 33, 3, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(87, 3, 33, 4, 1050.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(88, 3, 34, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(89, 3, 34, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(90, 3, 34, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(91, 3, 35, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(92, 3, 35, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(93, 3, 35, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(94, 3, 5, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(95, 3, 5, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(96, 3, 5, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(97, 3, 36, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(98, 3, 36, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(99, 3, 36, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(100, 3, 37, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(101, 3, 37, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(102, 3, 37, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(103, 3, 38, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(104, 3, 38, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(105, 3, 38, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(106, 3, 39, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(107, 3, 39, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(108, 3, 39, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(109, 3, 40, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(110, 3, 40, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(111, 3, 40, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(112, 3, 41, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(113, 3, 41, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(114, 3, 41, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(115, 3, 42, 1, 750.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(116, 3, 42, 3, 850.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42'),
(117, 3, 42, 4, 950.00, '2026-04-19 08:31:42', '2026-04-19 08:31:42');

-- --------------------------------------------------------

--
-- Table structure for table `tours`
--

CREATE TABLE `tours` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `province` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `highlights` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`highlights`)),
  `schedule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`schedule`)),
  `included` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`included`)),
  `not_included` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`not_included`)),
  `image_url` varchar(500) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery`)),
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`id`, `name`, `province`, `price`, `description`, `highlights`, `schedule`, `included`, `not_included`, `image_url`, `gallery`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Ang Thong National Marine Park', 'Surat Thani', 1900.00, 'Discover the breathtaking Ang Thong National Marine Park — a stunning archipelago of 42 islands with emerald lagoons, limestone cliffs, and pristine beaches. Kayak through hidden caves, snorkel in crystal-clear waters, and hike to panoramic viewpoints.', '[\"42 Islands\",\"Emerald Lagoon\",\"Kayaking\",\"Snorkeling\"]', '[{\"time\":\"07:00\",\"activity\":\"Pick up from hotel\"},{\"time\":\"08:30\",\"activity\":\"Depart from Nathon Pier\"},{\"time\":\"10:00\",\"activity\":\"Arrive at Ang Thong\"},{\"time\":\"10:30\",\"activity\":\"Kayaking & Emerald Lagoon\"},{\"time\":\"12:00\",\"activity\":\"Lunch on the boat\"},{\"time\":\"13:00\",\"activity\":\"Hiking to viewpoint\"},{\"time\":\"14:30\",\"activity\":\"Snorkeling & swimming\"},{\"time\":\"15:30\",\"activity\":\"Depart back\"},{\"time\":\"17:30\",\"activity\":\"Transfer to hotel\"}]', '[\"Round-trip boat transfer\",\"Thai buffet lunch\",\"Kayak & snorkeling gear\",\"English-speaking guide\",\"National park fee\",\"Travel insurance\"]', '[\"Personal expenses\",\"Tips\",\"Alcoholic beverages\"]', NULL, NULL, 1, 1, '2026-04-09 08:49:06', '2026-04-09 08:49:06'),
(2, 'Koh Tao & Koh Nang Yuan Snorkeling Trip', 'Surat Thani', 2200.00, 'Cruise to the famous Koh Tao and Koh Nang Yuan islands for a full day of world-class snorkeling. Explore vibrant coral reefs, swim with tropical fish, and relax on the iconic sandbar connecting three islands.', '[\"Koh Nang Yuan\",\"Coral reefs\",\"Tropical fish\",\"Viewpoint hike\"]', '[{\"time\":\"06:30\",\"activity\":\"Pick up from hotel\"},{\"time\":\"07:30\",\"activity\":\"Depart from pier\"},{\"time\":\"09:30\",\"activity\":\"Arrive at Koh Nang Yuan\"},{\"time\":\"10:00\",\"activity\":\"Hike to viewpoint\"},{\"time\":\"11:00\",\"activity\":\"Snorkeling at Japanese Garden\"},{\"time\":\"12:30\",\"activity\":\"Lunch at Koh Tao\"},{\"time\":\"14:00\",\"activity\":\"Snorkeling at Mango Bay\"},{\"time\":\"15:30\",\"activity\":\"Free time on the beach\"},{\"time\":\"16:00\",\"activity\":\"Depart back\"},{\"time\":\"18:00\",\"activity\":\"Transfer to hotel\"}]', '[\"Speedboat transfer\",\"Lunch\",\"Snorkeling equipment\",\"Guide\",\"National park fee\",\"Insurance\"]', '[\"Personal expenses\",\"Tips\",\"Underwater camera rental\",\"Koh Nang Yuan entrance fee (if separate)\"]', NULL, NULL, 2, 1, '2026-04-09 08:49:06', '2026-04-09 08:49:06'),
(3, 'Koh Phangan Day Trip', 'Surat Thani', 1500.00, 'Explore the beautiful Koh Phangan beyond the Full Moon Party. Visit pristine beaches, sacred temples, and a stunning waterfall. Enjoy snorkeling at secluded spots and a delicious Thai lunch by the sea.', '[\"Thong Nai Pan Beach\",\"Phaeng Waterfall\",\"Snorkeling\",\"Temple visit\"]', '[{\"time\":\"08:00\",\"activity\":\"Pick up from hotel\"},{\"time\":\"09:00\",\"activity\":\"Ferry to Koh Phangan\"},{\"time\":\"10:00\",\"activity\":\"Visit Wat Phu Khao Noi\"},{\"time\":\"11:00\",\"activity\":\"Phaeng Waterfall\"},{\"time\":\"12:00\",\"activity\":\"Lunch at Thong Nai Pan\"},{\"time\":\"13:30\",\"activity\":\"Snorkeling\"},{\"time\":\"15:00\",\"activity\":\"Beach free time\"},{\"time\":\"16:00\",\"activity\":\"Ferry back to Samui\"},{\"time\":\"17:00\",\"activity\":\"Transfer to hotel\"}]', '[\"Round-trip ferry\",\"Thai lunch\",\"Snorkeling gear\",\"Guide\",\"Insurance\"]', '[\"Personal expenses\",\"Tips\",\"National park fee (200 THB)\"]', NULL, NULL, 3, 1, '2026-04-09 08:49:06', '2026-04-09 08:49:06'),
(4, 'Samui Island Safari & Elephant Sanctuary', 'Surat Thani', 2000.00, 'Experience the wild side of Koh Samui with a 4x4 safari adventure. Visit an ethical elephant sanctuary, trek through the jungle, enjoy a coconut show, and take in panoramic island views.', '[\"Elephant sanctuary\",\"4x4 Safari\",\"Coconut show\",\"Jungle trek\"]', '[{\"time\":\"08:30\",\"activity\":\"Pick up from hotel\"},{\"time\":\"09:30\",\"activity\":\"Elephant sanctuary visit\"},{\"time\":\"11:00\",\"activity\":\"4x4 jungle safari\"},{\"time\":\"12:00\",\"activity\":\"Lunch at mountain viewpoint\"},{\"time\":\"13:30\",\"activity\":\"Coconut show & rubber plantation\"},{\"time\":\"14:30\",\"activity\":\"Na Muang Waterfall\"},{\"time\":\"15:30\",\"activity\":\"Secret Buddha Garden\"},{\"time\":\"16:30\",\"activity\":\"Transfer to hotel\"}]', '[\"Round-trip transfer\",\"Thai lunch\",\"Sanctuary entrance\",\"4x4 vehicle\",\"Guide\",\"Insurance\"]', '[\"Personal expenses\",\"Tips\",\"Professional photos\"]', NULL, NULL, 4, 1, '2026-04-09 08:49:06', '2026-04-09 08:49:06'),
(5, 'Koh Madsum & Koh Tan Snorkeling', 'Surat Thani', 1200.00, 'Escape to the tranquil islands of Koh Madsum (Pig Island) and Koh Tan, just south of Samui. Enjoy pristine beaches, meet the friendly pigs, snorkel over coral reefs, and relax in paradise.', '[\"Pig Island\",\"Koh Tan corals\",\"Pristine beaches\",\"Longtail boat\"]', '[{\"time\":\"09:30\",\"activity\":\"Pick up from hotel\"},{\"time\":\"10:30\",\"activity\":\"Depart from Thong Krut Pier\"},{\"time\":\"11:00\",\"activity\":\"Koh Madsum — meet the pigs!\"},{\"time\":\"12:00\",\"activity\":\"Lunch on the beach\"},{\"time\":\"13:00\",\"activity\":\"Koh Tan snorkeling\"},{\"time\":\"14:30\",\"activity\":\"Relax on Koh Tan beach\"},{\"time\":\"15:30\",\"activity\":\"Depart back\"},{\"time\":\"16:30\",\"activity\":\"Transfer to hotel\"}]', '[\"Longtail boat\",\"Thai lunch box\",\"Snorkeling gear\",\"Guide\",\"Insurance\"]', '[\"Personal expenses\",\"Tips\",\"Drinks\"]', NULL, NULL, 5, 1, '2026-04-09 08:49:06', '2026-04-09 08:49:06'),
(6, 'Sunset Dinner Cruise', 'Surat Thani', 2800.00, 'Sail into the golden Samui sunset aboard a traditional red Chinese junk boat. Enjoy a gourmet dinner, cocktails, and live music as the sun dips below the horizon over the Gulf of Thailand.', '[\"Sunset sailing\",\"Gourmet dinner\",\"Cocktails\",\"Live music\"]', '[{\"time\":\"16:00\",\"activity\":\"Pick up from hotel\"},{\"time\":\"16:30\",\"activity\":\"Board the boat at Bangrak Pier\"},{\"time\":\"17:00\",\"activity\":\"Set sail & welcome drinks\"},{\"time\":\"17:30\",\"activity\":\"Snorkeling stop (optional)\"},{\"time\":\"18:30\",\"activity\":\"Sunset viewing & cocktails\"},{\"time\":\"19:00\",\"activity\":\"Gourmet dinner served\"},{\"time\":\"20:00\",\"activity\":\"Live music & dessert\"},{\"time\":\"20:30\",\"activity\":\"Return to pier\"},{\"time\":\"21:00\",\"activity\":\"Transfer to hotel\"}]', '[\"Round-trip transfer\",\"Welcome cocktail\",\"3-course dinner\",\"Wine & drinks\",\"Live entertainment\",\"Insurance\"]', '[\"Personal expenses\",\"Tips\",\"Extra premium spirits\"]', NULL, NULL, 6, 1, '2026-04-09 08:49:06', '2026-04-09 08:49:06');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `max_passengers` int(11) NOT NULL,
  `max_luggage` int(11) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `name`, `description`, `max_passengers`, `max_luggage`, `base_price`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Sedan', 'Toyota Camry, Honda Accord or similar', 2, 3, 800.00, NULL, 1, 1, '2026-04-09 08:49:06', '2026-04-19 08:06:23'),
(2, 'Premium Sedan', 'Toyota Camry or similar', 3, 3, 1200.00, NULL, 2, 0, '2026-04-09 08:49:06', '2026-04-19 08:06:23'),
(3, 'SUV', 'Toyota Fortuner, Honda CR-V or similar', 3, 3, 1500.00, NULL, 2, 1, '2026-04-09 08:49:06', '2026-04-19 08:06:23'),
(4, 'Minivan', 'Toyota Commuter, Hyundai H-1 or similar', 8, 9, 1800.00, NULL, 3, 1, '2026-04-09 08:49:06', '2026-04-19 08:06:23'),
(5, 'VIP Van', 'Toyota Alphard or similar', 6, 6, 2500.00, NULL, 5, 0, '2026-04-09 08:49:06', '2026-04-19 08:06:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_ref` (`booking_ref`),
  ADD KEY `pickup_location_id` (`pickup_location_id`),
  ADD KEY `dropoff_location_id` (`dropoff_location_id`),
  ADD KEY `vehicle_id` (`vehicle_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `route_prices`
--
ALTER TABLE `route_prices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `route_vehicle` (`pickup_location_id`,`dropoff_location_id`,`vehicle_id`),
  ADD KEY `dropoff_location_id` (`dropoff_location_id`),
  ADD KEY `vehicle_id` (`vehicle_id`);

--
-- Indexes for table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `route_prices`
--
ALTER TABLE `route_prices`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`pickup_location_id`) REFERENCES `locations` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`dropoff_location_id`) REFERENCES `locations` (`id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`);

--
-- Constraints for table `route_prices`
--
ALTER TABLE `route_prices`
  ADD CONSTRAINT `route_prices_ibfk_1` FOREIGN KEY (`pickup_location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `route_prices_ibfk_2` FOREIGN KEY (`dropoff_location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `route_prices_ibfk_3` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

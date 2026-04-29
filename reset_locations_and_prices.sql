-- ============================================================
-- Reset locations & route_prices, then import from price.csv
-- Vehicles: Sedan=1, SUV=3, Minivan=4
-- ============================================================
USE `samui_sayhitransfer`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1) ล้างข้อมูลเดิม (ใช้ DELETE เพราะ TRUNCATE ติด FK constraint)
DELETE FROM `route_prices`;
DELETE FROM `locations`;
ALTER TABLE `route_prices` AUTO_INCREMENT = 1;
ALTER TABLE `locations` AUTO_INCREMENT = 1;

-- 2) เพิ่ม locations ใหม่ตามที่อยู่ใน price.csv
INSERT INTO `locations` (`id`, `name`, `type`, `sort_order`, `is_active`) VALUES
-- Airports
(1,  'Krabi Airport',                   'airport',    1,  1),
(2,  'Koh Samui Airport',               'airport',    2,  1),
(3,  'Phuket Airport',                  'airport',    3,  1),
-- Piers
(4,  'Ao Nammao Pier',                  'pier',       10, 1),
(5,  'Ao Po Pier',                      'pier',       11, 1),
-- Krabi hotel areas
(6,  'Krabi City Centre',               'hotel-area', 20, 1),
(7,  'Ao Nang / Nopparat Thara',        'hotel-area', 21, 1),
(8,  'Klong Muang',                     'hotel-area', 22, 1),
(9,  'Tub Kaek',                        'hotel-area', 23, 1),
(10, 'Klong Jin (Koh Lanta)',           'hotel-area', 24, 1),
(11, 'Ao Nang',                         'hotel-area', 25, 1),
-- Koh Samui hotel areas
(12, 'Pilae Laem',                      'hotel-area', 30, 1),
(13, 'Chaweng',                         'hotel-area', 31, 1),
(14, 'BangRak',                         'hotel-area', 32, 1),
(15, 'Bo Phut',                         'hotel-area', 33, 1),
(16, 'Choengmon',                       'hotel-area', 34, 1),
(17, 'Baan Tai',                        'hotel-area', 35, 1),
(18, 'Bang Por',                        'hotel-area', 36, 1),
(19, 'Lamai',                           'hotel-area', 37, 1),
(20, 'Mae Nam',                         'hotel-area', 38, 1),
(21, 'Hua Thanon',                      'hotel-area', 39, 1),
(22, 'Suan Pee Seua',                   'hotel-area', 40, 1),
(23, 'Na Thon',                         'hotel-area', 41, 1),
(24, 'Lipa Noi',                        'hotel-area', 42, 1),
(25, 'Pang Kha',                        'hotel-area', 43, 1),
(26, 'Conrad Area',                     'hotel-area', 44, 1),
(27, 'Baan Taling Ngam Area',           'hotel-area', 45, 1),
-- Phuket hotel areas
(28, 'Patong',                          'hotel-area', 50, 1),
(29, 'Karon',                           'hotel-area', 51, 1),
(30, 'Kata',                            'hotel-area', 52, 1),
(31, 'Patong / Kata / Karon',           'hotel-area', 53, 1),
(32, 'Rawai',                           'hotel-area', 54, 1),
(33, 'Nai Harn',                        'hotel-area', 55, 1),
(34, 'Chalong',                         'hotel-area', 56, 1),
(35, 'Cape Panwa',                      'hotel-area', 57, 1),
(36, 'Nai Yang',                        'hotel-area', 58, 1),
(37, 'Nai Thon Beach',                  'hotel-area', 59, 1),
(38, 'Mai Khao',                        'hotel-area', 60, 1),
(39, 'Kathu',                           'hotel-area', 61, 1),
(40, 'Bang Tao',                        'hotel-area', 62, 1),
(41, 'Surin',                           'hotel-area', 63, 1),
(42, 'Kamala',                          'hotel-area', 64, 1);

-- 3) เพิ่ม route_prices (vehicle_id: 1=Sedan, 3=SUV, 4=Minivan)
INSERT INTO `route_prices` (`pickup_location_id`, `dropoff_location_id`, `vehicle_id`, `price`) VALUES
-- Krabi Airport → ...
(1, 6,  1, 450), (1, 6,  3, 500), (1, 6,  4, 550),
(1, 4,  1, 600), (1, 4,  3, 700), (1, 4,  4, 750),
(1, 7,  1, 600), (1, 7,  3, 700), (1, 7,  4, 750),
(1, 8,  1, 700), (1, 8,  3, 800), (1, 8,  4, 900),
(1, 9,  1, 800), (1, 9,  3, 900), (1, 9,  4, 1000),
(1, 10, 1, 2600),(1, 10, 3, 2800),(1, 10, 4, 3000),
-- Koh Samui Airport → ...
(2, 12, 1, 590), (2, 12, 3, 650), (2, 12, 4, 700),
(2, 13, 1, 590), (2, 13, 3, 650), (2, 13, 4, 700),
(2, 14, 1, 590), (2, 14, 3, 650), (2, 14, 4, 700),
(2, 15, 1, 590), (2, 15, 3, 650), (2, 15, 4, 700),
(2, 16, 1, 590), (2, 16, 3, 650), (2, 16, 4, 700),
(2, 17, 1, 650), (2, 17, 3, 690), (2, 17, 4, 750),
(2, 18, 1, 690), (2, 18, 3, 750), (2, 18, 4, 800),
(2, 19, 1, 690), (2, 19, 3, 750), (2, 19, 4, 800),
(2, 20, 1, 690), (2, 20, 3, 750), (2, 20, 4, 800),
(2, 21, 1, 750), (2, 21, 3, 800), (2, 21, 4, 850),
(2, 22, 1, 750), (2, 22, 3, 800), (2, 22, 4, 850),
(2, 23, 1, 750), (2, 23, 3, 800), (2, 23, 4, 850),
(2, 24, 1, 950), (2, 24, 3, 1000),(2, 24, 4, 1050),
(2, 25, 1, 950), (2, 25, 3, 1000),(2, 25, 4, 1050),
(2, 26, 1, 950), (2, 26, 3, 1000),(2, 26, 4, 1050),
(2, 27, 1, 950), (2, 27, 3, 1000),(2, 27, 4, 1050),
-- Ao Nang → ...
(11, 3,  1, 2500),(11, 3,  3, 2800),(11, 3,  4, 3000),
(11, 31, 1, 2800),(11, 31, 3, 3000),(11, 31, 4, 2800),
-- Phuket Airport → ...
(3, 28, 1, 750), (3, 28, 3, 850), (3, 28, 4, 950),
(3, 29, 1, 750), (3, 29, 3, 850), (3, 29, 4, 950),
(3, 30, 1, 750), (3, 30, 3, 850), (3, 30, 4, 950),
(3, 32, 1, 850), (3, 32, 3, 950), (3, 32, 4, 1050),
(3, 33, 1, 850), (3, 33, 3, 950), (3, 33, 4, 1050),
(3, 34, 1, 750), (3, 34, 3, 850), (3, 34, 4, 950),
(3, 35, 1, 750), (3, 35, 3, 850), (3, 35, 4, 950),
(3, 5,  1, 750), (3, 5,  3, 850), (3, 5,  4, 950),
(3, 36, 1, 750), (3, 36, 3, 850), (3, 36, 4, 950),
(3, 37, 1, 750), (3, 37, 3, 850), (3, 37, 4, 950),
(3, 38, 1, 750), (3, 38, 3, 850), (3, 38, 4, 950),
(3, 39, 1, 750), (3, 39, 3, 850), (3, 39, 4, 950),
(3, 40, 1, 750), (3, 40, 3, 850), (3, 40, 4, 950),
(3, 41, 1, 750), (3, 41, 3, 850), (3, 41, 4, 950),
(3, 42, 1, 750), (3, 42, 3, 850), (3, 42, 4, 950);

SET FOREIGN_KEY_CHECKS = 1;

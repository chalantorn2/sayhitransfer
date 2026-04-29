-- Migration: support multiple vehicles per booking
-- Each row = one vehicle line item on a booking (quantity allows e.g. SUV x 2)

CREATE TABLE IF NOT EXISTS booking_vehicles (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id  INT UNSIGNED NOT NULL,
    vehicle_id  INT UNSIGNED NOT NULL,
    quantity    INT UNSIGNED NOT NULL DEFAULT 1,
    unit_price  DECIMAL(10,2) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bv_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_bv_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    INDEX idx_bv_booking (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Backfill existing bookings: one line item per booking from the legacy vehicle_id
INSERT INTO booking_vehicles (booking_id, vehicle_id, quantity, unit_price)
SELECT
    b.id,
    b.vehicle_id,
    1,
    CASE
        WHEN b.trip_type = 'return' THEN b.total_price / 2
        ELSE b.total_price
    END
FROM bookings b
LEFT JOIN booking_vehicles bv ON bv.booking_id = b.id
WHERE bv.id IS NULL;

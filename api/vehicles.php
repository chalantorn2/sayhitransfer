<?php

declare(strict_types=1);
require_once __DIR__ . '/config.php';

// GET /api/vehicles.php
// GET /api/vehicles.php?pickup=1&dropoff=8  → returns route-specific pricing
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();
$pickupId  = isset($_GET['pickup'])  ? (int) $_GET['pickup']  : 0;
$dropoffId = isset($_GET['dropoff']) ? (int) $_GET['dropoff'] : 0;

if ($pickupId > 0 && $dropoffId > 0) {
    // Return vehicles with route-specific price (fallback to base_price)
    // Only return vehicles that have a real price for this route (either direction).
    // If no row matches, the response is an empty array → frontend shows "route not served".
    $stmt = $db->prepare('
        SELECT
            v.id, v.name, v.description,
            v.max_passengers, v.max_luggage,
            v.image_url, v.sort_order,
            rp.price AS price
        FROM vehicles v
        INNER JOIN route_prices rp
            ON rp.vehicle_id = v.id
            AND (
                (rp.pickup_location_id = :pickup1 AND rp.dropoff_location_id = :dropoff1)
                OR
                (rp.pickup_location_id = :dropoff2 AND rp.dropoff_location_id = :pickup2)
            )
        WHERE v.is_active = 1
        ORDER BY v.sort_order, rp.price
    ');
    $stmt->execute([
        'pickup1'  => $pickupId,
        'dropoff1' => $dropoffId,
        'pickup2'  => $pickupId,
        'dropoff2' => $dropoffId,
    ]);
} else {
    // Return all vehicles with base price
    $stmt = $db->query('
        SELECT
            id, name, description,
            max_passengers, max_luggage,
            base_price AS price,
            image_url, sort_order
        FROM vehicles
        WHERE is_active = 1
        ORDER BY sort_order, base_price
    ');
}

$vehicles = $stmt->fetchAll();

// Cast numeric fields
$vehicles = array_map(function (array $v): array {
    $v['id']             = (int) $v['id'];
    $v['max_passengers'] = (int) $v['max_passengers'];
    $v['max_luggage']    = (int) $v['max_luggage'];
    $v['price']          = (float) $v['price'];
    $v['sort_order']     = (int) $v['sort_order'];
    return $v;
}, $vehicles);

jsonResponse($vehicles);

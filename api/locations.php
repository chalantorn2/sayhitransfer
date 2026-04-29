<?php

declare(strict_types=1);
require_once __DIR__ . '/config.php';

// GET /api/locations.php
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();
$stmt = $db->query('SELECT id, name, type, latitude, longitude, sort_order FROM locations WHERE is_active = 1 ORDER BY sort_order, name');
$locations = $stmt->fetchAll();

$locations = array_map(function (array $l): array {
    $l['id']        = (int) $l['id'];
    $l['latitude']  = $l['latitude']  !== null ? (float) $l['latitude']  : null;
    $l['longitude'] = $l['longitude'] !== null ? (float) $l['longitude'] : null;
    return $l;
}, $locations);

jsonResponse($locations);

<?php

declare(strict_types=1);
require_once __DIR__ . '/config.php';

// GET /api/locations.php
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();
$stmt = $db->query('SELECT id, name, type, sort_order FROM locations WHERE is_active = 1 ORDER BY sort_order, name');
$locations = $stmt->fetchAll();

jsonResponse($locations);

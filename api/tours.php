<?php

declare(strict_types=1);
require_once __DIR__ . '/config.php';

// GET /api/tours.php        → list all active tours
// GET /api/tours.php?id=1   → single tour detail
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$db = getDB();

if (isset($_GET['id'])) {
    // ── Single tour ─────────────────────────────────────────
    $stmt = $db->prepare('SELECT * FROM tours WHERE id = :id AND is_active = 1');
    $stmt->execute(['id' => (int) $_GET['id']]);
    $tour = $stmt->fetch();

    if (!$tour) {
        jsonError('Tour not found', 404);
    }

    $tour['id']       = (int) $tour['id'];
    $tour['price']    = (float) $tour['price'];
    $tour['highlights']   = json_decode($tour['highlights'], true);
    $tour['schedule']     = json_decode($tour['schedule'], true);
    $tour['included']     = json_decode($tour['included'], true);
    $tour['not_included'] = json_decode($tour['not_included'], true);
    $tour['gallery']      = json_decode($tour['gallery'] ?? '[]', true) ?: [];

    jsonResponse($tour);
}

// ── List all tours ──────────────────────────────────────────
$stmt = $db->query('
    SELECT id, name, province, price, description, highlights, image_url
    FROM tours
    WHERE is_active = 1
    ORDER BY sort_order, name
');
$tours = $stmt->fetchAll();

$tours = array_map(function (array $t): array {
    $t['id']         = (int) $t['id'];
    $t['price']      = (float) $t['price'];
    $t['highlights'] = json_decode($t['highlights'], true);
    return $t;
}, $tours);

jsonResponse($tours);

<?php

declare(strict_types=1);
require_once __DIR__ . '/config.php';

// POST /api/bookings.php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$data = getJsonBody();

requireFields($data, [
    'trip_type', 'pickup_location_id', 'dropoff_location_id',
    'pickup_date', 'pickup_time',
    'total_price', 'first_name', 'last_name', 'email', 'phone',
]);

// Validate trip_type
if (!in_array($data['trip_type'], ['oneway', 'return'], true)) {
    jsonError('Invalid trip_type. Must be "oneway" or "return".');
}

// Validate return fields if return trip
if ($data['trip_type'] === 'return') {
    requireFields($data, ['return_date', 'return_time']);
}

// Validate vehicles array (new multi-vehicle support)
if (!isset($data['vehicles']) || !is_array($data['vehicles']) || count($data['vehicles']) === 0) {
    jsonError('At least one vehicle must be selected.');
}

$vehicleLines = [];
foreach ($data['vehicles'] as $line) {
    if (!isset($line['vehicle_id'], $line['quantity'], $line['unit_price'])) {
        jsonError('Each vehicle line must include vehicle_id, quantity, and unit_price.');
    }
    $qty = (int) $line['quantity'];
    if ($qty < 1) continue;
    $vehicleLines[] = [
        'vehicle_id' => (int) $line['vehicle_id'],
        'quantity'   => $qty,
        'unit_price' => (float) $line['unit_price'],
    ];
}
if (count($vehicleLines) === 0) {
    jsonError('At least one vehicle with quantity >= 1 is required.');
}

// Pick the primary vehicle (highest quantity; ties broken by first appearance) for legacy bookings.vehicle_id column
$primaryVehicleId = $vehicleLines[0]['vehicle_id'];
$primaryQty = $vehicleLines[0]['quantity'];
foreach ($vehicleLines as $line) {
    if ($line['quantity'] > $primaryQty) {
        $primaryQty = $line['quantity'];
        $primaryVehicleId = $line['vehicle_id'];
    }
}

// Generate booking reference
$bookingRef = 'SHT-' . strtoupper(date('ymd')) . '-' . strtoupper(substr(uniqid(), -5));

$db = getDB();

try {
$db->beginTransaction();

$stmt = $db->prepare('
    INSERT INTO bookings (
        booking_ref, trip_type,
        pickup_location_id, pickup_hotel_name, pickup_hotel_address, pickup_lat, pickup_lng,
        dropoff_location_id, dropoff_hotel_name, dropoff_hotel_address, dropoff_lat, dropoff_lng,
        pickup_date, pickup_time,
        return_date, return_time,
        adults, children, infants,
        vehicle_id, total_price,
        first_name, last_name, email, phone,
        line_id, flight_number, special_requests,
        status
    ) VALUES (
        :booking_ref, :trip_type,
        :pickup_location_id, :pickup_hotel_name, :pickup_hotel_address, :pickup_lat, :pickup_lng,
        :dropoff_location_id, :dropoff_hotel_name, :dropoff_hotel_address, :dropoff_lat, :dropoff_lng,
        :pickup_date, :pickup_time,
        :return_date, :return_time,
        :adults, :children, :infants,
        :vehicle_id, :total_price,
        :first_name, :last_name, :email, :phone,
        :line_id, :flight_number, :special_requests,
        "pending"
    )
');

$stmt->execute([
    'booking_ref'           => $bookingRef,
    'trip_type'             => $data['trip_type'],
    'pickup_location_id'    => (int) $data['pickup_location_id'],
    'pickup_hotel_name'     => $data['pickup_hotel_name']    ?? null,
    'pickup_hotel_address'  => $data['pickup_hotel_address'] ?? null,
    'pickup_lat'            => isset($data['pickup_lat']) ? (float) $data['pickup_lat'] : null,
    'pickup_lng'            => isset($data['pickup_lng']) ? (float) $data['pickup_lng'] : null,
    'dropoff_location_id'   => (int) $data['dropoff_location_id'],
    'dropoff_hotel_name'    => $data['dropoff_hotel_name']    ?? null,
    'dropoff_hotel_address' => $data['dropoff_hotel_address'] ?? null,
    'dropoff_lat'           => isset($data['dropoff_lat']) ? (float) $data['dropoff_lat'] : null,
    'dropoff_lng'           => isset($data['dropoff_lng']) ? (float) $data['dropoff_lng'] : null,
    'pickup_date'           => $data['pickup_date'],
    'pickup_time'           => $data['pickup_time'],
    'return_date'           => $data['return_date'] ?? null,
    'return_time'           => $data['return_time'] ?? null,
    'adults'                => (int) ($data['adults'] ?? 1),
    'children'              => (int) ($data['children'] ?? 0),
    'infants'               => (int) ($data['infants'] ?? 0),
    'vehicle_id'            => $primaryVehicleId,
    'total_price'           => (float) $data['total_price'],
    'first_name'            => $data['first_name'],
    'last_name'             => $data['last_name'],
    'email'                 => $data['email'],
    'phone'                 => $data['phone'],
    'line_id'               => $data['line_id']          ?? null,
    'flight_number'         => $data['flight_number']    ?? null,
    'special_requests'      => $data['special_requests'] ?? null,
]);

$bookingId = (int) $db->lastInsertId();

// Insert vehicle line items
$lineStmt = $db->prepare('
    INSERT INTO booking_vehicles (booking_id, vehicle_id, quantity, unit_price)
    VALUES (:booking_id, :vehicle_id, :quantity, :unit_price)
');
foreach ($vehicleLines as $line) {
    $lineStmt->execute([
        'booking_id' => $bookingId,
        'vehicle_id' => $line['vehicle_id'],
        'quantity'   => $line['quantity'],
        'unit_price' => $line['unit_price'],
    ]);
}

$db->commit();
} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    jsonError('Booking failed: ' . $e->getMessage(), 500);
}

// ── Fetch full booking details for email ────────────────────
$stmt = $db->prepare('
    SELECT
        b.*,
        pl.name AS pickup_name,
        dl.name AS dropoff_name
    FROM bookings b
    JOIN locations pl ON pl.id = b.pickup_location_id
    JOIN locations dl ON dl.id = b.dropoff_location_id
    WHERE b.id = :id
');
$stmt->execute(['id' => $bookingId]);
$booking = $stmt->fetch();

$stmt = $db->prepare('
    SELECT bv.quantity, bv.unit_price, v.name AS vehicle_name
    FROM booking_vehicles bv
    JOIN vehicles v ON v.id = bv.vehicle_id
    WHERE bv.booking_id = :id
    ORDER BY bv.id
');
$stmt->execute(['id' => $bookingId]);
$booking['vehicles'] = $stmt->fetchAll();

// ── Send email notification to admin ────────────────────────
sendAdminNotification($booking);
sendCustomerConfirmation($booking);

jsonResponse([
    'success'     => true,
    'booking_ref' => $bookingRef,
    'booking_id'  => $bookingId,
], 201);

// ── Email Functions ─────────────────────────────────────────

function sendAdminNotification(array $b): void
{
    $tripType = $b['trip_type'] === 'return' ? 'Return' : 'One Way';
    $returnInfo = $b['trip_type'] === 'return'
        ? "<tr><td style='padding:8px;color:#666'>Return</td><td style='padding:8px;font-weight:600'>{$b['return_date']} at {$b['return_time']}</td></tr>"
        : '';

    $pickupBlock  = formatLocationBlock($b['pickup_name'],  $b['pickup_hotel_name'],  $b['pickup_hotel_address'],  $b['pickup_lat'],  $b['pickup_lng']);
    $dropoffBlock = formatLocationBlock($b['dropoff_name'], $b['dropoff_hotel_name'], $b['dropoff_hotel_address'], $b['dropoff_lat'], $b['dropoff_lng']);
    $vehicleBlock = formatVehicleBlock($b['vehicles'] ?? [], $b['trip_type']);

    $subject = "New Booking: {$b['booking_ref']} — {$b['first_name']} {$b['last_name']}";

    $html = <<<HTML
    <div style="font-family:'Prompt',Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e40af;color:#fff;padding:20px;border-radius:12px 12px 0 0">
            <h2 style="margin:0">New Transfer Booking</h2>
            <p style="margin:5px 0 0;opacity:.8">{$b['booking_ref']}</p>
        </div>
        <div style="background:#fff;padding:20px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
            <h3 style="color:#1e3a8a;margin-top:0">Customer</h3>
            <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;color:#666">Name</td><td style="padding:8px;font-weight:600">{$b['first_name']} {$b['last_name']}</td></tr>
                <tr><td style="padding:8px;color:#666">Email</td><td style="padding:8px">{$b['email']}</td></tr>
                <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px">{$b['phone']}</td></tr>
                <tr><td style="padding:8px;color:#666">LINE</td><td style="padding:8px">{$b['line_id']}</td></tr>
            </table>

            <h3 style="color:#1e3a8a">Transfer Details</h3>
            <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;color:#666">Type</td><td style="padding:8px;font-weight:600">{$tripType}</td></tr>
                <tr><td style="padding:8px;color:#666;vertical-align:top">Pick-up</td><td style="padding:8px">{$pickupBlock}</td></tr>
                <tr><td style="padding:8px;color:#666;vertical-align:top">Drop-off</td><td style="padding:8px">{$dropoffBlock}</td></tr>
                <tr><td style="padding:8px;color:#666">Date & Time</td><td style="padding:8px;font-weight:600">{$b['pickup_date']} at {$b['pickup_time']}</td></tr>
                {$returnInfo}
                <tr><td style="padding:8px;color:#666;vertical-align:top">Vehicles</td><td style="padding:8px;font-weight:600">{$vehicleBlock}</td></tr>
                <tr><td style="padding:8px;color:#666">Passengers</td><td style="padding:8px">{$b['adults']} ADT, {$b['children']} CHD, {$b['infants']} INF</td></tr>
                <tr><td style="padding:8px;color:#666">Flight</td><td style="padding:8px">{$b['flight_number']}</td></tr>
                <tr><td style="padding:8px;color:#666">Special Requests</td><td style="padding:8px">{$b['special_requests']}</td></tr>
            </table>

            <div style="margin-top:15px;padding:15px;background:#eff6ff;border-radius:8px;text-align:center">
                <span style="font-size:24px;font-weight:700;color:#1d4ed8">{$b['total_price']} THB</span>
            </div>
        </div>
    </div>
    HTML;

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . MAIL_NAME . " <" . MAIL_FROM . ">\r\n";

    @mail(ADMIN_EMAIL, $subject, $html, $headers);
}

function sendCustomerConfirmation(array $b): void
{
    $tripType = $b['trip_type'] === 'return' ? 'Return' : 'One Way';

    $pickupLabel  = formatCustomerLocationLabel($b['pickup_name'],  $b['pickup_hotel_name']);
    $dropoffLabel = formatCustomerLocationLabel($b['dropoff_name'], $b['dropoff_hotel_name']);
    $vehicleLabel = formatVehicleLabel($b['vehicles'] ?? []);

    $subject = "Booking Confirmation — {$b['booking_ref']} | SayHi Transfer";

    $html = <<<HTML
    <div style="font-family:'Prompt',Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e40af;color:#fff;padding:24px;border-radius:12px 12px 0 0;text-align:center">
            <h2 style="margin:0">Thank You for Your Booking!</h2>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
            <p>Dear {$b['first_name']},</p>
            <p>We have received your transfer booking. Our team will review and confirm your booking within <strong>3 hours</strong>.</p>

            <div style="margin:20px 0;padding:15px;background:#eff6ff;border-radius:8px;text-align:center">
                <p style="margin:0;color:#666;font-size:14px">Booking Reference</p>
                <p style="margin:5px 0;font-size:24px;font-weight:700;color:#1d4ed8;letter-spacing:2px">{$b['booking_ref']}</p>
            </div>

            <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:8px;color:#666;border-bottom:1px solid #f3f4f6">Type</td><td style="padding:8px;font-weight:500;border-bottom:1px solid #f3f4f6">{$tripType}</td></tr>
                <tr><td style="padding:8px;color:#666;border-bottom:1px solid #f3f4f6;vertical-align:top">Pick-up</td><td style="padding:8px;font-weight:500;border-bottom:1px solid #f3f4f6">{$pickupLabel}</td></tr>
                <tr><td style="padding:8px;color:#666;border-bottom:1px solid #f3f4f6;vertical-align:top">Drop-off</td><td style="padding:8px;font-weight:500;border-bottom:1px solid #f3f4f6">{$dropoffLabel}</td></tr>
                <tr><td style="padding:8px;color:#666;border-bottom:1px solid #f3f4f6">Date & Time</td><td style="padding:8px;font-weight:500;border-bottom:1px solid #f3f4f6">{$b['pickup_date']} at {$b['pickup_time']}</td></tr>
                <tr><td style="padding:8px;color:#666;border-bottom:1px solid #f3f4f6;vertical-align:top">Vehicle</td><td style="padding:8px;font-weight:500;border-bottom:1px solid #f3f4f6">{$vehicleLabel}</td></tr>
                <tr><td style="padding:8px;color:#666">Total</td><td style="padding:8px;font-weight:700;font-size:18px;color:#1d4ed8">{$b['total_price']} THB</td></tr>
            </table>

            <p style="margin-top:20px;color:#666;font-size:13px">
                If you have any questions, feel free to contact us:<br>
                Email: info@sayhitransfer.com<br>
                LINE: @sayhitransfer
            </p>

            <p style="color:#999;font-size:12px;margin-top:20px;text-align:center">
                &copy; SayHi Transfer — Thailand
            </p>
        </div>
    </div>
    HTML;

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . MAIL_NAME . " <" . MAIL_FROM . ">\r\n";

    @mail($b['email'], $subject, $html, $headers);
}

// ── Location formatting helpers ─────────────────────────────

function formatLocationBlock(?string $zone, ?string $hotelName, ?string $hotelAddress, $lat, $lng): string
{
    $zone = htmlspecialchars((string) $zone, ENT_QUOTES, 'UTF-8');

    if (empty($hotelName)) {
        return "<span style='font-weight:600'>{$zone}</span>";
    }

    $hotel   = htmlspecialchars($hotelName, ENT_QUOTES, 'UTF-8');
    $address = htmlspecialchars((string) $hotelAddress, ENT_QUOTES, 'UTF-8');
    $mapsLink = '';

    if ($lat !== null && $lng !== null) {
        $lat = (float) $lat;
        $lng = (float) $lng;
        $url = "https://www.google.com/maps/search/?api=1&query={$lat},{$lng}";
        $mapsLink = "<br><a href='{$url}' style='color:#1d4ed8;font-size:12px'>📍 Open in Google Maps</a>";
    }

    $addressLine = $address !== '' ? "<br><span style='color:#666;font-size:12px'>{$address}</span>" : '';

    return "<span style='font-weight:600'>{$hotel}</span>"
         . "<br><span style='color:#888;font-size:12px'>Zone: {$zone}</span>"
         . $addressLine
         . $mapsLink;
}

function formatVehicleBlock(array $vehicles, string $tripType): string
{
    if (empty($vehicles)) return '';
    $multiplier = $tripType === 'return' ? 2 : 1;
    $rows = [];
    foreach ($vehicles as $v) {
        $name = htmlspecialchars((string) $v['vehicle_name'], ENT_QUOTES, 'UTF-8');
        $qty  = (int) $v['quantity'];
        $line = (float) $v['unit_price'] * $qty * $multiplier;
        $rows[] = "{$name} × {$qty} <span style='color:#888;font-size:12px'>(" . number_format($line, 0) . " THB)</span>";
    }
    return implode('<br>', $rows);
}

function formatVehicleLabel(array $vehicles): string
{
    if (empty($vehicles)) return '';
    $rows = [];
    foreach ($vehicles as $v) {
        $name = htmlspecialchars((string) $v['vehicle_name'], ENT_QUOTES, 'UTF-8');
        $qty  = (int) $v['quantity'];
        $rows[] = "{$name} × {$qty}";
    }
    return implode('<br>', $rows);
}

function formatCustomerLocationLabel(?string $zone, ?string $hotelName): string
{
    $zone = htmlspecialchars((string) $zone, ENT_QUOTES, 'UTF-8');
    if (empty($hotelName)) {
        return $zone;
    }
    $hotel = htmlspecialchars($hotelName, ENT_QUOTES, 'UTF-8');
    return "{$hotel}<br><span style='color:#888;font-size:12px'>({$zone})</span>";
}

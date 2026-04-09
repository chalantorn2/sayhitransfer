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
    'pickup_date', 'pickup_time', 'vehicle_id',
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

// Generate booking reference
$bookingRef = 'SHT-' . strtoupper(date('ymd')) . '-' . strtoupper(substr(uniqid(), -5));

$db = getDB();

$stmt = $db->prepare('
    INSERT INTO bookings (
        booking_ref, trip_type,
        pickup_location_id, dropoff_location_id,
        pickup_date, pickup_time,
        return_date, return_time,
        adults, children, infants,
        vehicle_id, total_price,
        first_name, last_name, email, phone,
        line_id, flight_number, special_requests,
        status
    ) VALUES (
        :booking_ref, :trip_type,
        :pickup_location_id, :dropoff_location_id,
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
    'booking_ref'         => $bookingRef,
    'trip_type'           => $data['trip_type'],
    'pickup_location_id'  => (int) $data['pickup_location_id'],
    'dropoff_location_id' => (int) $data['dropoff_location_id'],
    'pickup_date'         => $data['pickup_date'],
    'pickup_time'         => $data['pickup_time'],
    'return_date'         => $data['return_date'] ?? null,
    'return_time'         => $data['return_time'] ?? null,
    'adults'              => (int) ($data['adults'] ?? 1),
    'children'            => (int) ($data['children'] ?? 0),
    'infants'             => (int) ($data['infants'] ?? 0),
    'vehicle_id'          => (int) $data['vehicle_id'],
    'total_price'         => (float) $data['total_price'],
    'first_name'          => $data['first_name'],
    'last_name'           => $data['last_name'],
    'email'               => $data['email'],
    'phone'               => $data['phone'],
    'line_id'             => $data['line_id'] ?? null,
    'flight_number'       => $data['flight_number'] ?? null,
    'special_requests'    => $data['special_requests'] ?? null,
]);

$bookingId = (int) $db->lastInsertId();

// ── Fetch full booking details for email ────────────────────
$stmt = $db->prepare('
    SELECT
        b.*,
        pl.name AS pickup_name,
        dl.name AS dropoff_name,
        v.name  AS vehicle_name
    FROM bookings b
    JOIN locations pl ON pl.id = b.pickup_location_id
    JOIN locations dl ON dl.id = b.dropoff_location_id
    JOIN vehicles v   ON v.id  = b.vehicle_id
    WHERE b.id = :id
');
$stmt->execute(['id' => $bookingId]);
$booking = $stmt->fetch();

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
                <tr><td style="padding:8px;color:#666">Pick-up</td><td style="padding:8px;font-weight:600">{$b['pickup_name']}</td></tr>
                <tr><td style="padding:8px;color:#666">Drop-off</td><td style="padding:8px;font-weight:600">{$b['dropoff_name']}</td></tr>
                <tr><td style="padding:8px;color:#666">Date & Time</td><td style="padding:8px;font-weight:600">{$b['pickup_date']} at {$b['pickup_time']}</td></tr>
                {$returnInfo}
                <tr><td style="padding:8px;color:#666">Vehicle</td><td style="padding:8px;font-weight:600">{$b['vehicle_name']}</td></tr>
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
                <tr><td style="padding:8px;color:#666;border-bottom:1px solid #f3f4f6">Pick-up</td><td style="padding:8px;font-weight:500;border-bottom:1px solid #f3f4f6">{$b['pickup_name']}</td></tr>
                <tr><td style="padding:8px;color:#666;border-bottom:1px solid #f3f4f6">Drop-off</td><td style="padding:8px;font-weight:500;border-bottom:1px solid #f3f4f6">{$b['dropoff_name']}</td></tr>
                <tr><td style="padding:8px;color:#666;border-bottom:1px solid #f3f4f6">Date & Time</td><td style="padding:8px;font-weight:500;border-bottom:1px solid #f3f4f6">{$b['pickup_date']} at {$b['pickup_time']}</td></tr>
                <tr><td style="padding:8px;color:#666;border-bottom:1px solid #f3f4f6">Vehicle</td><td style="padding:8px;font-weight:500;border-bottom:1px solid #f3f4f6">{$b['vehicle_name']}</td></tr>
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

<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
    $upload_dir = '../';
    $upload_file = $upload_dir . basename($_FILES['file']['name']);

    if (move_uploaded_file($_FILES['file']['tmp_name'], $upload_file)) {
        echo json_encode(['status' => 'success', 'message' => 'File uploaded successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'File upload failed.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
}
?>


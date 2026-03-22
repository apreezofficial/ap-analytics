<?php
/**
 * Analytics API Index
 * 
 * This file redirects all requests to track.php
 * Provides cleaner URLs for the API
 * 
 * Host at: api.preciousadedokun.com.ng/v1/analytics
 */

// Redirect to track.php with the original request URI
$_SERVER['REQUEST_URI'] = str_replace('/index.php', '/track', $_SERVER['REQUEST_URI']);
require_once __DIR__ . '/track.php';

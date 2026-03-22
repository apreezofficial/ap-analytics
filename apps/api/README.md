# Advanced Analytics System v2.0.0

A powerful, file-based analytics system built with PHP that tracks page views, UTM parameters, time on page, performance metrics, and more. Perfect for tracking multiple projects from a single API.

## API Endpoint

```
https://api.preciousadedokun.com.ng/v1/analytics
```

## Features

- ✅ **Multi-Project Support** - Track unlimited websites from one API
- ✅ **API Key Authentication** - Secure global access for anyone
- ✅ **Time on Page Tracking** - See how long visitors stay
- ✅ **Page Performance Metrics** - Load time, TTFB, FCP, LCP, CLS, FID
- ✅ **Session Management** - Track visitor sessions and durations
- ✅ **UTM Attribution** - First-touch and last-touch attribution
- ✅ **Referrer Tracking** - Know where your traffic comes from
- ✅ **Device Detection** - Mobile, tablet, desktop, bot
- ✅ **Browser & OS Detection** - Know your visitor's setup
- ✅ **Geographic Data** - Country, city, ISP
- ✅ **Scroll Depth Tracking** - How far users scroll
- ✅ **Custom Events** - Track any action
- ✅ **File-Based Database** - No MySQL required
- ✅ **SPA Support** - Works with React, Vue, Next.js, etc.

## Quick Start

### 1. Basic Usage (No API Key Required)

```html
<script>
  window.analyticsConfig = {
    projectId: 'my_website'
  };
</script>
<script src="https://api.preciousadedokun.com.ng/v1/analytics/analytics.js" async defer></script>
```

### 2. With API Key (For Global Access)

```html
<script>
  window.analyticsConfig = {
    apiUrl: 'https://api.preciousadedokun.com.ng/v1/analytics/track',
    apiKey: 'global_analytics_key_2024',  // Anyone can use this!
    projectId: 'my_website',
    projectName: 'My Awesome Website',
    domain: 'example.com'
  };
</script>
<script src="https://api.preciousadedokun.com.ng/v1/analytics/analytics.js" async defer></script>
```

## Configuration Options

| Option | Required | Description |
|--------|----------|-------------|
| `apiUrl` | No | Analytics API URL |
| `apiKey` | No | API key for authentication (use `global_analytics_key_2024` for public access) |
| `projectId` | Yes | Unique identifier for your project |
| `projectName` | No | Human-readable project name |
| `domain` | No | Your domain for reference |
| `debug` | No | Enable console logging |

## API Endpoints

### Track Page View or Event

```http
POST /v1/analytics/track
X-Project-ID: my_project
X-API-Key: global_analytics_key_2024
Content-Type: application/json

{
  "project_id": "my_project",
  "project_name": "My Website",
  "page": "/home",
  "title": "Home Page",
  "page_url": "https://example.com/home",
  "referrer": "https://google.com",
  "utm": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "spring_sale"
  },
  "session_id": "s_1234567890_abc123",
  "time_on_page": 45.5,
  "page_load_time": 2.3,
  "ttfb": 0.5,
  "dom_ready_time": 1.2,
  "scroll_depth": 75
}
```

### Track Custom Event

```http
POST /v1/analytics/track
Content-Type: application/json

{
  "type": "event",
  "project_id": "my_project",
  "category": "button_click",
  "action": "signup",
  "label": "header_cta",
  "value": 1,
  "page": "/pricing"
}
```

### Get Analytics Summary

```http
GET /v1/analytics/summary?project_id=my_project&days=7
X-API-Key: global_analytics_key_2024
```

### Get Detailed Analytics

```http
GET /v1/analytics/analytics?project_id=my_project&type=performance
GET /v1/analytics/analytics?project_id=my_project&type=pagetime
GET /v1/analytics/analytics?project_id=my_project&type=utm
```

Types: `all`, `pageviews`, `utm`, `referrers`, `devices`, `locations`, `events`, `performance`, `pagetime`, `sessions`

### Get Time Series

```http
GET /v1/analytics/timeseries?project_id=my_project&days=30
```

### List Projects

```http
GET /v1/analytics/projects
```

### Health Check

```http
GET /v1/analytics/health
```

## JavaScript API

### Track Custom Events

```javascript
// Track button click
Analytics.trackEvent('button_click', 'signup', 'header_cta', 1);

// Track form submission
Analytics.trackEvent('form', 'submit', 'contact_form', 5);

// Track video play
Analytics.trackEvent('video', 'play', 'intro_video', 0);

// Track file download
Analytics.trackEvent('download', 'click', 'pricing_pdf', 1);
```

### Get UTM Parameters

```javascript
// Get current URL UTM
var utm = Analytics.getUTMParams();
console.log(utm); // { utm_source: 'google', utm_medium: 'cpc' }

// Get first touch (stored from first visit)
var firstTouch = Analytics.getFirstTouchUTM();

// Get last touch (stored from last visit)
var lastTouch = Analytics.getStoredUTM();
```

### Get Performance Data

```javascript
var perf = Analytics.getPerformanceData();
console.log(perf);
// {
//   loadTime: 2.3,
//   ttfb: 0.5,
//   fcp: 1.2,
//   lcp: 2.1,
//   cls: 0.05,
//   fid: 0.1
// }
```

### Get Session

```javascript
var session = Analytics.getSession();
console.log(session.id); // Unique session ID
```

## Performance Metrics Tracked

| Metric | Description |
|--------|-------------|
| `page_load_time` | Total page load time (seconds) |
| `dom_ready_time` | Time until DOM is ready |
| `ttfb` | Time To First Byte |
| `first_paint` | First paint time |
| `fcp` | First Contentful Paint |
| `lcp` | Largest Contentful Paint |
| `cls` | Cumulative Layout Shift |
| `fid` | First Input Delay |
| `tbt` | Total Blocking Time |

## UTM Parameters Tracked

| Parameter | Description | Example |
|-----------|-------------|---------|
| utm_source | Traffic source | google, facebook, newsletter |
| utm_medium | Marketing medium | cpc, email, social |
| utm_campaign | Campaign name | spring_sale_2024 |
| utm_term | Search keywords | web developer |
| utm_content | Ad content | banner_1 |
| utm_id | Campaign ID | campaign_123 |

## Data Storage

All data stored in JSON files in `backend/data/`:

- `projects.json` - Registered projects
- `pageviews.json` - All page views
- `sessions.json` - Visitor sessions
- `utm.json` - UTM statistics
- `referrers.json` - Referrer data
- `devices.json` - Device statistics
- `locations.json` - Geographic data
- `events.json` - Custom events
- `performance.json` - Page performance averages
- `pagetime.json` - Time on page data

## Server Requirements

- PHP 7.4+
- Apache with mod_rewrite
- Write permissions on `data/` directory

## Deployment

1. Upload `backend/` folder to your server
2. Point domain to `backend/` folder
3. Set `data/` to writable: `chmod 755 data`
4. Access at: `https://api.preciousadedokun.com.ng/v1/analytics/`

## License

MIT License

---
title: "ShopInsight - E-commerce Analytics Engine"
description: "A high-performance analytics platform processing millions of events daily, providing real-time insights for e-commerce businesses."
pubDate: 2023-08-15
heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop"
technologies: ["Python", "Apache Kafka", "ClickHouse", "FastAPI", "React", "Docker"]
role: "Backend Engineer"
duration: "8 months"
liveUrl: "https://shopinsight-demo.example.com"
featured: true
draft: false
---

## Project Overview

E-commerce businesses generate massive amounts of data—page views, cart additions, purchases, returns—but most struggle to turn this data into actionable insights. ShopInsight was built to solve this by providing real-time analytics that help businesses understand customer behavior and optimize their sales funnel.

### The Challenge

Our client, a mid-sized e-commerce platform, was facing:
- **Data silos** - Analytics spread across Google Analytics, internal databases, and third-party tools
- **Delayed insights** - Reports took hours to generate, missing real-time opportunities
- **Scale limitations** - Existing solution couldn't handle Black Friday traffic spikes
- **Limited customization** - Off-the-shelf tools didn't support their specific KPIs

### Project Goals

1. Unify all analytics data into a single source of truth
2. Provide sub-second query response times
3. Handle 10x traffic spikes without degradation
4. Enable custom dashboards and real-time alerting

---

## My Role & Contributions

As a **Backend Engineer**, I focused on:

- Designing and implementing the event ingestion pipeline
- Building the data processing layer with Apache Kafka
- Optimizing ClickHouse queries for complex analytics
- Creating the FastAPI backend serving the dashboard
- Implementing real-time alerting system
- Writing comprehensive documentation and runbooks

---

## Technical Deep Dive

### Event Ingestion Architecture

The system needed to handle bursts of 50,000+ events per second during peak traffic. I designed a multi-stage pipeline:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Website    │───▶│   Kafka      │───▶│   Flink      │
│   Events     │    │   Cluster    │    │   Processor  │
└──────────────┘    └──────────────┘    └──────────────┘
                                               │
                    ┌──────────────────────────┴───────┐
                    ▼                                  ▼
            ┌──────────────┐                  ┌──────────────┐
            │  ClickHouse  │                  │    Redis     │
            │  (Analytics) │                  │  (Real-time) │
            └──────────────┘                  └──────────────┘
```

### Data Modeling for Speed

ClickHouse's columnar storage is powerful but requires careful schema design. I implemented a star schema optimized for our most common queries:

```sql
-- Fact table optimized for time-series analytics
CREATE TABLE events (
    event_time DateTime,
    event_date Date,
    user_id UInt64,
    session_id String,
    event_type Enum8('page_view'=1, 'add_to_cart'=2, ...),
    product_id UInt32,
    revenue Decimal(10,2),
    -- Materialized columns for fast filtering
    hour UInt8 MATERIALIZED toHour(event_time),
    day_of_week UInt8 MATERIALIZED toDayOfWeek(event_date)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, event_type, user_id)
```

### Real-Time Funnel Analysis

One of the most requested features was real-time funnel visualization. I built a custom aggregation engine:

```python
async def calculate_funnel(
    steps: list[str],
    time_window: timedelta,
    filters: dict
) -> FunnelResult:
    """
    Calculate conversion funnel with configurable steps.
    Uses windowFunnel function for accurate sequential analysis.
    """
    query = f"""
    SELECT
        windowFunnel({time_window.seconds})(
            event_time,
            {', '.join(f"event_type = '{step}'" for step in steps)}
        ) as funnel_step,
        count() as users
    FROM events
    WHERE {build_filter_clause(filters)}
    GROUP BY funnel_step
    ORDER BY funnel_step
    """
    return await execute_and_transform(query)
```

---

## Challenges Overcome

### Challenge 1: Handling Traffic Spikes

**Problem:** Black Friday traffic was 15x normal volume, causing ingestion lag.

**Solution:**
- Implemented adaptive batching in Kafka consumers
- Added auto-scaling for Flink processing nodes
- Pre-warmed ClickHouse with expected query patterns

**Result:** Zero data loss during 2023 Black Friday with 2M events/minute peak.

### Challenge 2: Query Performance at Scale

**Problem:** Complex funnel queries on 6 months of data took 30+ seconds.

**Solution:**
- Created materialized views for common aggregations
- Implemented query result caching with intelligent invalidation
- Added sampling for exploratory queries with option for exact results

**Result:** 95th percentile query time reduced from 32s to 1.2s.

### Challenge 3: Data Accuracy

**Problem:** Event deduplication was causing 3% data discrepancy.

**Solution:**
- Implemented idempotent event processing with Redis-based dedup
- Added data quality monitoring with automated alerts
- Created reconciliation jobs comparing source and processed counts

**Result:** Data accuracy improved to 99.97%.

---

## Results & Metrics

### Performance Improvements

| Metric | Before | After |
|--------|--------|-------|
| Event ingestion latency | 5-30 min | < 2 sec |
| Dashboard load time | 8 sec | 0.8 sec |
| Max events/second | 5,000 | 80,000 |
| Query response (p95) | 32 sec | 1.2 sec |

### Business Impact

- **23% increase** in conversion rate through funnel optimization insights
- **$2.1M additional revenue** attributed to real-time abandoned cart alerts
- **60% reduction** in time spent generating reports
- **4 hours saved weekly** per analyst on manual data compilation

---

## Key Learnings

1. **Schema design is crucial** - Spending extra time on ClickHouse schema design paid dividends in query performance.

2. **Monitor everything** - Comprehensive observability helped us catch issues before users noticed.

3. **Plan for failure** - Dead letter queues and retry mechanisms prevented data loss during incidents.

4. **Sampling is your friend** - For exploratory analysis, 10% samples give 95% of insights at 10x speed.

---

## Screenshots

### Real-Time Dashboard
![Analytics dashboard with live metrics](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop)
*Live dashboard showing key metrics updating in real-time*

### Funnel Analysis
![Conversion funnel visualization](https://images.unsplash.com/photo-1543286386-713bbd7c2c57?w=800&h=500&fit=crop)
*Interactive funnel analysis with drill-down capabilities*

### Custom Report Builder
![Report builder interface](https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop)
*Drag-and-drop report builder for custom analytics*

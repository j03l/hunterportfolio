---
title: "CloudGate - Serverless API Gateway"
description: "An open-source API gateway built on AWS Lambda, featuring automatic rate limiting, request validation, and comprehensive observability."
pubDate: 2023-11-01
heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop"
technologies: ["Go", "AWS Lambda", "DynamoDB", "CloudWatch", "Terraform", "OpenAPI"]
role: "Core Contributor"
duration: "Ongoing (4 months active)"
repoUrl: "https://github.com/example/cloudgate"
featured: false
draft: false
---

## Project Overview

CloudGate started as an internal tool at my company when we found AWS API Gateway's pricing prohibitive at scale. What began as a cost-saving measure evolved into a fully-featured, open-source API gateway that other teams could benefit from.

### The Motivation

Our microservices architecture had grown to 40+ services, each with multiple endpoints. Using AWS API Gateway, we were spending:

- **$15,000/month** on API Gateway requests alone
- Additional costs for custom authorizers
- Significant time managing gateway configurations

### Project Goals

1. Reduce API gateway costs by 80%+
2. Maintain feature parity with AWS API Gateway
3. Improve developer experience with better tooling
4. Share the solution with the community

---

## My Contributions

As a **Core Contributor** to this open-source project, I:

- Designed and implemented the rate limiting system
- Built the request/response transformation layer
- Created the OpenAPI integration for automatic route generation
- Developed the Terraform module for infrastructure deployment
- Wrote comprehensive documentation and examples
- Reviewed PRs and mentored new contributors

---

## Technical Architecture

### System Design

CloudGate uses a serverless architecture to minimize operational overhead:

```
                    ┌─────────────────────────────────────┐
                    │           CloudFront CDN            │
                    │         (Edge Caching)              │
                    └─────────────────────────────────────┘
                                      │
                    ┌─────────────────────────────────────┐
                    │        Application Load Balancer     │
                    │          (SSL Termination)           │
                    └─────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┴─────────────────────────────┐
        │                                                           │
        ▼                                                           ▼
┌───────────────────┐                                   ┌───────────────────┐
│   Lambda @ Edge   │                                   │   Lambda @ Edge   │
│   (Auth Layer)    │                                   │   (Auth Layer)    │
└───────────────────┘                                   └───────────────────┘
        │                                                           │
        ▼                                                           ▼
┌───────────────────┐                                   ┌───────────────────┐
│   Core Gateway    │                                   │   Core Gateway    │
│   Lambda (Go)     │                                   │   Lambda (Go)     │
└───────────────────┘                                   └───────────────────┘
        │                                                           │
        │              ┌─────────────────────┐                     │
        └──────────────│     DynamoDB        │─────────────────────┘
                       │  (Config & State)   │
                       └─────────────────────┘
                                │
                       ┌────────┴────────┐
                       ▼                 ▼
               ┌─────────────┐   ┌─────────────┐
               │   Backend   │   │   Backend   │
               │  Service A  │   │  Service B  │
               └─────────────┘   └─────────────┘
```

### Rate Limiting Implementation

I designed a distributed rate limiting system using DynamoDB's atomic counters:

```go
// Token bucket implementation with DynamoDB backend
type RateLimiter struct {
    table     *dynamodb.Table
    keyPrefix string
}

func (r *RateLimiter) Allow(ctx context.Context, key string, limit RateLimit) (bool, error) {
    now := time.Now().Unix()
    windowKey := fmt.Sprintf("%s:%s:%d", r.keyPrefix, key, now/int64(limit.Window.Seconds()))

    // Atomic increment with conditional check
    result, err := r.table.UpdateItem(ctx, &dynamodb.UpdateItemInput{
        Key: map[string]types.AttributeValue{
            "pk": &types.AttributeValueMemberS{Value: windowKey},
        },
        UpdateExpression: aws.String("SET #count = if_not_exists(#count, :zero) + :inc, #ttl = :ttl"),
        ExpressionAttributeNames: map[string]string{
            "#count": "count",
            "#ttl":   "ttl",
        },
        ExpressionAttributeValues: map[string]types.AttributeValue{
            ":zero": &types.AttributeValueMemberN{Value: "0"},
            ":inc":  &types.AttributeValueMemberN{Value: "1"},
            ":ttl":  &types.AttributeValueMemberN{Value: strconv.FormatInt(now+int64(limit.Window.Seconds())*2, 10)},
        },
        ReturnValues: types.ReturnValueAllNew,
    })

    if err != nil {
        return false, fmt.Errorf("rate limit check failed: %w", err)
    }

    count, _ := strconv.Atoi(result.Attributes["count"].(*types.AttributeValueMemberN).Value)
    return count <= limit.Requests, nil
}
```

### OpenAPI Integration

One of my key contributions was automatic route generation from OpenAPI specs:

```go
// Parse OpenAPI spec and generate Lambda routes
func GenerateRoutes(spec *openapi3.T) []Route {
    var routes []Route

    for path, pathItem := range spec.Paths {
        for method, operation := range pathItem.Operations() {
            route := Route{
                Path:       convertOpenAPIPath(path),
                Method:     method,
                OperationID: operation.OperationID,
                Validators:  extractValidators(operation),
                RateLimit:   extractRateLimit(operation.Extensions),
                Backend:     extractBackendConfig(operation.Extensions),
            }
            routes = append(routes, route)
        }
    }

    return routes
}
```

---

## Challenges & Solutions

### Challenge 1: Cold Start Latency

**Problem:** Go Lambda cold starts added 200-400ms to first requests.

**Solution:**
- Implemented provisioned concurrency for critical paths
- Created a warm-up mechanism using CloudWatch scheduled events
- Optimized binary size by removing unused dependencies

**Result:** P99 latency reduced from 450ms to 85ms.

### Challenge 2: Configuration Consistency

**Problem:** Distributed Lambdas could have stale configurations.

**Solution:**
- Implemented configuration versioning in DynamoDB
- Added config polling with exponential backoff
- Created a cache invalidation mechanism via SNS

### Challenge 3: Observability at Scale

**Problem:** Debugging issues across thousands of requests was difficult.

**Solution:**
- Implemented distributed tracing with X-Ray integration
- Created custom CloudWatch dashboards per-route
- Built a log aggregation pipeline to S3 for long-term analysis

---

## Impact & Results

### Cost Savings

| Resource | AWS API Gateway | CloudGate | Savings |
|----------|----------------|-----------|---------|
| Monthly requests (100M) | $3,500 | $180 | **95%** |
| Custom authorizers | $2,000 | $50 | **97%** |
| Data transfer | $1,500 | $1,500 | 0% |
| **Total Monthly** | **$7,000** | **$1,730** | **75%** |

### Performance Metrics

- **P50 latency:** 12ms (vs 25ms API Gateway)
- **P99 latency:** 85ms (vs 150ms API Gateway)
- **Throughput:** 50,000 req/s per region
- **Uptime:** 99.99% over 6 months

### Community Adoption

- **GitHub stars:** 1,200+
- **Production deployments:** 15+ companies
- **Contributors:** 23 (from 8 countries)
- **NPM downloads:** 5,000/week (Terraform module)

---

## Lessons Learned

1. **Go is excellent for Lambda** - The combination of fast cold starts, small binaries, and strong concurrency primitives made Go the perfect choice.

2. **DynamoDB is underrated** - With proper schema design, DynamoDB handles our distributed state needs elegantly.

3. **Open source is a commitment** - Maintaining an open source project requires significant ongoing effort for issues, PRs, and documentation.

4. **Measure twice, optimize once** - Profiling revealed that our biggest latency came from unexpected places (JSON serialization, not network calls).

---

## Future Roadmap

- [ ] WebSocket support
- [ ] GraphQL-specific optimizations
- [ ] Multi-region active-active deployment
- [ ] Enhanced caching with Redis/ElastiCache option

---

## Screenshots

### Infrastructure Dashboard
![Terraform infrastructure visualization](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop)
*Terraform-managed infrastructure with full visibility*

### Metrics Dashboard
![CloudWatch metrics dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop)
*Real-time metrics showing request latency and throughput*

### Route Configuration
![OpenAPI route configuration](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop)
*Visual route configuration generated from OpenAPI specs*

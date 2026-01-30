---
title: "TypeScript Patterns That Changed How I Code"
description: "Advanced TypeScript patterns including discriminated unions, branded types, and the builder pattern that make your code safer and more expressive."
pubDate: 2024-03-05
tags: ["typescript", "patterns", "javascript"]
draft: false
---

TypeScript is more than just "JavaScript with types." Once you learn these patterns, you'll wonder how you ever coded without them.

## Discriminated Unions for State Management

Instead of nullable fields, use discriminated unions:

```typescript
// ❌ Nullable fields lead to impossible states
interface ApiResponse {
  data?: User;
  error?: Error;
  loading: boolean;
}

// ✅ Discriminated union - each state is explicit
type ApiResponse =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'success':
      // TypeScript knows `data` exists here
      console.log(response.data.name);
      break;
    case 'error':
      // TypeScript knows `error` exists here
      console.log(response.error.message);
      break;
  }
}
```

## Branded Types for Type Safety

Prevent mixing up similar primitive types:

```typescript
// Create branded types
type UserId = string & { __brand: 'UserId' };
type PostId = string & { __brand: 'PostId' };

// Helper functions to create branded values
const createUserId = (id: string): UserId => id as UserId;
const createPostId = (id: string): PostId => id as PostId;

// Now TypeScript prevents mixing them up
function getUser(id: UserId) { /* ... */ }
function getPost(id: PostId) { /* ... */ }

const userId = createUserId('user-123');
const postId = createPostId('post-456');

getUser(userId); // ✅ Works
getUser(postId); // ❌ Type error!
```

## The Builder Pattern with Method Chaining

Create fluent APIs with full type safety:

```typescript
class QueryBuilder<T> {
  private filters: string[] = [];
  private sortField?: keyof T;
  private limitValue?: number;

  where<K extends keyof T>(field: K, value: T[K]): this {
    this.filters.push(`${String(field)} = ${value}`);
    return this;
  }

  orderBy(field: keyof T): this {
    this.sortField = field;
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  build(): string {
    let query = `SELECT * FROM table`;
    if (this.filters.length) {
      query += ` WHERE ${this.filters.join(' AND ')}`;
    }
    if (this.sortField) {
      query += ` ORDER BY ${String(this.sortField)}`;
    }
    if (this.limitValue) {
      query += ` LIMIT ${this.limitValue}`;
    }
    return query;
  }
}

// Usage with full autocomplete
interface User {
  id: number;
  name: string;
  email: string;
}

const query = new QueryBuilder<User>()
  .where('name', 'John')  // TypeScript ensures 'name' is valid
  .orderBy('email')       // And 'email' too
  .limit(10)
  .build();
```

## Const Assertions for Literal Types

```typescript
// Without as const - type is string[]
const routes = ['home', 'about', 'contact'];

// With as const - type is readonly ['home', 'about', 'contact']
const routes = ['home', 'about', 'contact'] as const;

// Now you can derive types from it
type Route = typeof routes[number]; // 'home' | 'about' | 'contact'
```

## Template Literal Types

Create expressive string types:

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiVersion = 'v1' | 'v2';
type Endpoint = `/${ApiVersion}/${string}`;

// Combine them
type ApiRoute = `${HttpMethod} ${Endpoint}`;

// Valid
const route1: ApiRoute = 'GET /v1/users';
const route2: ApiRoute = 'POST /v2/posts';

// Invalid
const route3: ApiRoute = 'PATCH /v1/users'; // ❌ PATCH not in HttpMethod
```

## Conditional Types for Flexible APIs

```typescript
type ApiResponse<T> = T extends undefined
  ? { success: boolean }
  : { success: boolean; data: T };

function apiCall<T = undefined>(endpoint: string): ApiResponse<T> {
  // Implementation
}

// Returns { success: boolean }
const deleteResult = apiCall('/users/1');

// Returns { success: boolean; data: User }
const getResult = apiCall<User>('/users/1');
```

---

These patterns might feel like overkill at first, but they've saved me countless runtime errors. The compiler becomes your pair programmer, catching bugs before they reach production.

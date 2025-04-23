# High performance server

## 1. Introduction

School project comparing WebSocket and gRPC performances.
The application demonstrates real-time image transfer using both protocols to analyze their performance characteristics.

**Objective**
Compare WebSocket and gRPC by:
- Implementing image transfer using both technologies
- Measuring and analyzing performance metrics
- Documenting advantages and limitations of each approach

## 2. Getting started
### 2.1 Requirements
- Docker

### 2.2 Installation
1. Clone the repository
2. Create a `.env` file in the root directory with the `.env.example` file
3. (Optional) Run `npm install` inside each service directory

### 2.3 Launch
1. Run `docker compose up`

The application will:
- Start both services (transmitter and receiver)
- Transfer 10 images via WebSocket and after 10 images via gRPC
- Log transmission times in `output.log`


## 3. WebSocket
### 3.1 Advantages
- Bidirectional real-time communication  
- Persistent open connection  
- Lightweight and easy to implement  
- Flexible payloads (text, JSON, binary blobs)
### 3.2 Disadvantages
- May be blocked  
- Less efficient for binary compared to gRPC  
- No built-in type safety (no enforced schema)
### 3.3 Performance results

## 4. gRPC
### 4.1 Advantages
- High performance 
- Strongly typed contract via proto definitions  
- Full-duplex streaming supported  
### 4.2 Disadvantages
- Binary format harder to debug 
- More complex to implement  
- Requires HTTP/2, not natively supported in browsers without a proxy server
### 4.3 Performance results

## 5. Comparative summary

| Criterion               | WebSocket               | gRPC                          |
|------------------------|-------------------------|-------------------------------|
| Real-time bidirectional| ✅                      | ✅                            |
| Performance            | ⚠️ Medium               | ✅ Excellent        |
| Type safety            | ❌                      | ✅ Strongly typed             |
| Browser compatibility  | ✅ Native                | ❌ Requires HTTP/2 + proxy    |
| Ease of implementation | ✅ Simple                | ⚠️ More complex               |
| Best suited for        | UI real-time apps       | microservices services  |

## 6. Recommended use cases

## 7. Conclusion
(references, ressources)
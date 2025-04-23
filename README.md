# High performance server

## 1. Introduction

This project explores the differences between websocket and gRPC through a practical implementation. The system consists of two servers: a transmitter and a receiver.

The transmitter server sends the same image ten times to the receiver, first using websocket protocol, then using gRPC. The receiver processes these images and captures performance metrics for each protocol.

To ensure a fair comparison between both protocols, each image transmission includes a one-second delay, creating a controlled environment for performance measurement.

For both websocket and gRPC, it measures three key metrics: the transmission time for each image, the total transfer time including the artificial delays, and the cumulative transmission time of all images.

While this implementation intentionally maintains similar patterns for both protocols to ensure testing fairness, i acknowledge that the chosen approach might not fully leverage the unique advantages or use cases of each method. This decision was made to provide a consistent baseline for comparison, even though it may not represent the optimal implementation for either websocket or gRPC.

## 2. Getting started
### 2.1 Requirements
- Docker

### 2.2 Installation
1. Clone the repository
2. Create a `.env` file in the root directory with the `.env.example` file
3. (Optional) Run `npm install` inside each service directory

### 2.3 Running the project
```bash
docker compose up
```
To run in detached mode:
```bash
docker compose up -d
```

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

| Criterion               | websocket               | gRPC                          |
|------------------------|-------------------------|-------------------------------|
| Real-time bidirectional| ✅                      | ✅                            |
| Performance            | ⚠️ Medium               | ✅ Excellent        |
| Type safety            | ❌                      | ✅ Strongly typed             |
| Browser compatibility  | ✅ Native                | ❌ Requires HTTP/2 + proxy    |
| Ease of implementation | ✅ Simple                | ⚠️ More complex               |

## 6. Recommended use cases

## 7. Conclusion
(references, ressources)
# High performance server

## 1. What's this project about ?

This project explores the differences between websocket and gRPC through a practical implementation. The system consists of two servers: a transmitter and a receiver. The transmitter server sends the same image ten times to the receiver, first using websocket protocol, then using gRPC. The receiver processes these images and captures performance metrics for each protocol.

For both websocket and gRPC, it measures three key metrics: the transmission time for each image, the total transfer time including the artificial delays, and the cumulative transmission time of all images.


> [!NOTE]
> While this implementation intentionally maintains similar patterns for both protocols to ensure testing fairness, i acknowledge that the chosen approach might not fully leverage the unique advantages or use cases of each method. This decision was made to provide a consistent baseline for comparison, even though it may not represent the optimal implementation for either WebSocket or gRPC.

## 2. Getting started
### Technologies
[Node.js](https://nodejs.org/),
[Typescript](https://www.typescriptlang.org/),
[Fastify](https://www.fastify.io/),
[gRPC](https://grpc.io/),
[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API),
[Docker](https://www.docker.com/)

### Requirements
- Docker

### Installation
1. Clone the repository
2. Duplicate the `.env.example` file to a new `.env` file
```bash
cp .env.example .env
```
3. (Optional) Install dependencies inside each service directory
```bash
npm install
```
### Run the project
```bash
docker compose up
```

## 3. WebSocket
### Advantages
- Bidirectional real-time communication  
- Lightweight and easy to implement  
- Flexible payloads (text, JSON, binary blobs)
### Disadvantages
- May be blocked  
- Less efficient for binary compared to gRPC  
- No built-in type safety (no enforced schema)
### Performance results
```bash
=== WebSocket performance test: 10 images transfer ===

Image 0 transmission time: 670ms
Image 1 transmission time: 699ms
Image 2 transmission time: 688ms
Image 3 transmission time: 660ms
Image 4 transmission time: 629ms
Image 5 transmission time: 595ms
Image 6 transmission time: 554ms
Image 7 transmission time: 519ms
Image 8 transmission time: 501ms
Image 9 transmission time: 491ms

Total transfer time: 1116ms
Sum of transmission times: 6006ms
```

## 4. gRPC
### Advantages
- High performance 
- Strongly typed contract 
- Full-duplex streaming supported  
### Disadvantages
- Binary format harder to debug 
- More complex to implement  
- Requires HTTP/2, not natively supported in browsers without a proxy server
### Performance results
```bash
=== gRPC performance test: 10 images transfer ===

Image 1 transmission time: 23ms
Image 2 transmission time: 44ms
Image 3 transmission time: 55ms
Image 4 transmission time: 66ms
Image 5 transmission time: 78ms
Image 6 transmission time: 87ms
Image 7 transmission time: 99ms
Image 8 transmission time: 111ms
Image 9 transmission time: 125ms
Image 10 transmission time: 138ms

Total transfer time: 228ms
Sum of transmission times: 826ms
```

## 5. Comparative summary

| Criterion               | websocket               | gRPC                          |
|------------------------|-------------------------|-------------------------------|
| Real-time bidirectional| ✅                      | ✅                            |
| Performance            | ⚠️ Medium               | ✅ Excellent        |
| Type safety            | ❌                      | ✅ Strongly typed             |
| Browser compatibility  | ✅ Native                | ❌ Requires HTTP/2 + proxy    |
| Ease of implementation | ✅ Simple                | ⚠️ More complex               |

## 6. Conclusion and Recommended Use Cases

The performance results show that gRPC is more efficient in raw data transmission. However, this advantage shouldn't drive alone the choice between these protocols, as each serves distinct purposes :

WebSocket are good for web-based real-time applications. Its simple implementation and broad browser support make it ideal for direct real-time client-server communication.

usecases : live chat applications, collaborative editing tools, or real-time dashboards

gRPC is better suited for system-to-system communications. Its strict contract-based interactions and high performance make it valuable for backend services.

usecases: microservices architectures, internal system communications, and scenarios requiring strict contract-based interactions

## 7. Resources

- [gRPC documentation](https://grpc.io/docs/languages/node/)
- [Fastify websocket](https://github.com/fastify/fastify-websocket)

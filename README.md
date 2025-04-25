# High performance server

## 1. What's this project about ?

This project explores the differences between websocket and gRPC through a practical implementation. The system consists of two servers: a transmitter and a receiver. The transmitter server sends the same image ten times to the receiver, first using websocket protocol, then using gRPC. The receiver processes these images and captures performance metrics for each technology in the `output.log` file.

For both websocket and gRPC, it measures three key metrics: the transmission time for each image and the total transfer time.

- **Image details**: The test uses a 533KB PNG image
- **Network environment**: All tests were performed in local

> [!NOTE]
> While this implementation intentionally maintains similar patterns for both technologies to ensure testing fairness, i acknowledge that the chosen approach might not fully leverage the unique advantages or use cases of each method. This decision was made to provide a consistent baseline for comparison, even though it may not represent the optimal implementation for either WebSocket or gRPC.

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
- Easy to implement  
- Flexible payloads : text, JSON, binary blobs, etc
- Native support in browsers
### Disadvantages
- May be blocked by firewalls  
- Less efficient for binary compared to gRPC  
- No built-in type safety : no enforced schema
- Connection management requires additional handling : connection is always open
### Performance results
```bash
=== WebSocket performance test: 10 images transfer ===

Image transmission time: 361ms
Image transmission time: 357ms
Image transmission time: 356ms
Image transmission time: 345ms
Image transmission time: 339ms
Image transmission time: 332ms
Image transmission time: 325ms
Image transmission time: 324ms
Image transmission time: 323ms
Image transmission time: 318ms

Total transfer time: 663ms
```

## 4. gRPC
### Advantages
- High performance 
- Strongly typed contract 
- Full-duplex streaming supported  
### Disadvantages
- Binary format harder to debug 
- More complex to implement : higher initial setup complexity
- Requires HTTP/2, not natively supported in browsers without a proxy server
### Performance results
```bash
=== gRPC performance test: 10 images transfer ===

Image transmission time: 32ms
Image transmission time: 55ms
Image transmission time: 66ms
Image transmission time: 76ms
Image transmission time: 83ms
Image transmission time: 89ms
Image transmission time: 98ms
Image transmission time: 105ms
Image transmission time: 114ms
Image transmission time: 123ms

Total transfer time: 203ms
```

> [!NOTE]
> Here we can see that gRPC handles concurrent requests more efficiently. The total transfer time is significantly lower due to HTTP/2 so it outperforms the WebSocket implementation ( in individual transmissions also ).

## 5. Comparative summary

| Criterion               | websocket               | gRPC                          |
|------------------------|-------------------------|-------------------------------|
| Real-time bidirectional| ✅                      | ✅                            |
| Performance            | ⚠️ Medium               | ✅ Excellent        |
| Type safety            | ❌                      | ✅ Strongly typed             |
| Browser compatibility  | ✅ Native                | ❌ Not natively supported    |
| Ease of implementation | ✅ Simple                | ⚠️ More complex               |

## 6. Conclusion and Recommended Use Cases

The performance results show that gRPC is more efficient in raw data transmission. However, this advantage shouldn't drive alone the choice between these technologies, as each serves distinct purposes :

WebSockets are good for web-based real-time applications. Its simple implementation and broad browser support make it ideal for direct web real-time client-server communication.

usecases : live chat applications, collaborative editing tools, or real-time dashboards

gRPC is better suited for system-to-system communications. Its strict contract-based interactions and high performance make it valuable for backend services.

usecases: microservices architectures, internal system communications, and scenarios requiring strict contract-based interactions

## 7. Resources

- [gRPC documentation](https://grpc.io/docs/languages/node/)
- [Fastify websocket](https://github.com/fastify/fastify-websocket)

# High performance server

## 1. What's this project about ?

This project explores the differences between websocket and gRPC through a practical implementation. The system consists of two servers: a transmitter and a receiver. The transmitter server sends the same image ten times to the receiver, first using websocket protocol, then using gRPC. The receiver processes these images and captures performance metrics for each technology in the `output.log` file.

For both websocket and gRPC, it measures three key metrics: the transmission time for each image and the total transfer time.

- **Image details**: 533KB, png
- **Network environment**: local

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
- Less efficient compared to gRPC  
- No built-in type safety : no enforced schema
- Requires manual connection state management
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
- High performance : through HTTP/2 and protocol buffers
- Strongly typed contract 
- Full-duplex streaming supported  
### Disadvantages
- Binary format harder to debug 
- More complex to implement : higher initial setup complexity
- Requires HTTP/2, not natively supported in browsers
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
> Here we can see that gRPC handles concurrent requests more efficiently. The total transfer time is significantly lower due to HTTP/2 multiplexing and Protocol Buffers binary serialization format so it outperforms the WebSocket implementation ( in individual transmissions also ). We can futher see this in the 50 images transfer test below.

```bash
=== WebSocket performance test: 50 images transfer ===

Image transmission time: 1665ms
Image transmission time: 1715ms
Image transmission time: 1711ms
Image transmission time: 1700ms
Image transmission time: 1696ms
Image transmission time: 1689ms
Image transmission time: 1681ms
Image transmission time: 1687ms
Image transmission time: 1674ms
Image transmission time: 1670ms
Image transmission time: 1665ms
Image transmission time: 1660ms
Image transmission time: 1652ms
Image transmission time: 1652ms
Image transmission time: 1634ms
Image transmission time: 1642ms
Image transmission time: 1646ms
Image transmission time: 1636ms
Image transmission time: 1633ms
Image transmission time: 1623ms
Image transmission time: 1630ms
Image transmission time: 1620ms
Image transmission time: 1615ms
Image transmission time: 1617ms
Image transmission time: 1601ms
Image transmission time: 1587ms
Image transmission time: 1573ms
Image transmission time: 1560ms
Image transmission time: 1545ms
Image transmission time: 1533ms
Image transmission time: 1518ms
Image transmission time: 1509ms
Image transmission time: 1499ms
Image transmission time: 1490ms
Image transmission time: 1460ms
Image transmission time: 1479ms
Image transmission time: 1449ms
Image transmission time: 1429ms
Image transmission time: 1428ms
Image transmission time: 1417ms
Image transmission time: 1399ms
Image transmission time: 1411ms
Image transmission time: 1392ms
Image transmission time: 1385ms
Image transmission time: 1380ms
Image transmission time: 1371ms
Image transmission time: 1360ms
Image transmission time: 1350ms
Image transmission time: 1342ms
Image transmission time: 1335ms

Total transfer time: 2984ms


=== gRPC performance test: 50 images transfer ===

Image transmission time: 22ms
Image transmission time: 31ms
Image transmission time: 36ms
Image transmission time: 41ms
Image transmission time: 48ms
Image transmission time: 55ms
Image transmission time: 73ms
Image transmission time: 79ms
Image transmission time: 88ms
Image transmission time: 97ms
Image transmission time: 105ms
Image transmission time: 112ms
Image transmission time: 119ms
Image transmission time: 126ms
Image transmission time: 134ms
Image transmission time: 141ms
Image transmission time: 147ms
Image transmission time: 152ms
Image transmission time: 158ms
Image transmission time: 164ms
Image transmission time: 174ms
Image transmission time: 178ms
Image transmission time: 183ms
Image transmission time: 187ms
Image transmission time: 192ms
Image transmission time: 196ms
Image transmission time: 202ms
Image transmission time: 212ms
Image transmission time: 217ms
Image transmission time: 222ms
Image transmission time: 228ms
Image transmission time: 233ms
Image transmission time: 240ms
Image transmission time: 244ms
Image transmission time: 251ms
Image transmission time: 256ms
Image transmission time: 261ms
Image transmission time: 265ms
Image transmission time: 274ms
Image transmission time: 279ms
Image transmission time: 284ms
Image transmission time: 289ms
Image transmission time: 294ms
Image transmission time: 299ms
Image transmission time: 305ms
Image transmission time: 312ms
Image transmission time: 319ms
Image transmission time: 324ms
Image transmission time: 330ms
Image transmission time: 333ms

Total transfer time: 419ms
```

## 5. Comparative summary

| Criterion               | websocket               | gRPC                          |
|------------------------|-------------------------|-------------------------------|
| Real-time bidirectional| ✅                      | ✅                            |
| Performance            | ⚠️ Medium               | ✅ Excellent        |
| Type safety            | ❌                      | ✅ Strongly typed             |
| Browser compatibility  | ✅ Native                | ❌ Not natively supported    |
| Ease of implementation | ✅ Simple                | ⚠️ More complex               |
| Connection management  | ⚠️ Manual handling      | ✅ Built-in connection pooling|

## 6. Conclusion and Recommended Use Cases

The performance results show that gRPC is more efficient in raw data transmission. However, this advantage shouldn't drive alone the choice between these technologies, as each serves distinct purposes :

WebSockets are good for web-based real-time applications. Its simple implementation and broad browser support make it ideal for direct web real-time client-server communication if moderate latency is acceptable.

usecases : live chat applications, queue indicators or real-time dashboards

gRPC is better suited for system-to-system communications. Its strict contract-based interactions and high performance make it valuable for backend services.

usecases: microservices architectures or internal system communications

> [!WARNING]
> **Limitations of this comparison:**
> - No tracking of CPU and memory usage
> - Tests performed in a local environment
> - Implementation prioritized comparison consistency over protocol-specific optimizations
> - Test focused on image transfer, which may not represent the best use case for gRPC or websocket

## 7. Resources

- [gRPC documentation](https://grpc.io/docs/languages/node/)
- [Fastify websocket](https://github.com/fastify/fastify-websocket)

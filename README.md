# High performance server

## 1. Introduction

School project comparing WebSocket and gRPC performance in real-time image transfer.
The application demonstrates real-time image transfer using both protocols to analyze their performance characteristics.

### Objective
Compare WebSocket and gRPC by:
- Implementing image transfer using both technologies
- Measuring and analyzing performance metrics
- Documenting advantages and limitations of each approach

## 2. Getting started
- **Requirements**:
- Docker


- **Installation**:
1. Clone the repository
2. Create a `.env` file in the root directory with the `.env.example` file
3. (Optional) Run `npm install` inside each service directory

- **Launch**:
1. Run `docker compose up`

The application will:
- Start both services (transmitter and receiver)
- Transfer 10 images via WebSocket
- Log transmission times in `output.log`


## 3. WebSocket
### 3.1 Principle
### 3.2 Advantages
### 3.3 Disadvantages
### 3.4 Performance results

## 4. gRPC
### 4.1 Principle
### 4.2 Advantages
### 4.3 Disadvantages
### 4.4 Performance results

## 5. Comparative summary

## 6. Recommended use cases

## 7. Conclusion
(references)
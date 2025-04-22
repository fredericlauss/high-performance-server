# High performance server

## Project Overview

School project comparing WebSocket and gRPC performance in real-time image transfer.
The application demonstrates real-time image transfer using both protocols to analyze their performance characteristics.

### Objective
Compare WebSocket and gRPC by:
- Implementing image transfer using both technologies
- Measuring and analyzing performance metrics
- Documenting advantages and limitations of each approach

## Prerequisites

- Docker

## Setup

1. Clone the repository
2. Create a `.env` file in the root directory with the `.env.example` file

## Usage

1. Run `docker compose up`

The application will:
- Start both services (transmitter and receiver)
- Transfer 10 images via WebSocket
- Log transmission times in `output.log`

## WebSocket 

### Performance Metrics

Check `output.log` file for detailed performance metrics of the WebSocket image transfer:
- Transmission time for each image

### WebSocket Advantages
- Real-time Updates
- Simple Implementation

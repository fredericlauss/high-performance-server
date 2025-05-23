// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: src/proto/image_transfer.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import {
  type CallOptions,
  ChannelCredentials,
  Client,
  type ClientDuplexStream,
  type ClientOptions,
  type handleBidiStreamingCall,
  makeGenericClientConstructor,
  Metadata,
  type UntypedServiceImplementation,
} from "@grpc/grpc-js";

export const protobufPackage = "image_transfer";

export interface ImageData {
  timestamp: number;
  image: Buffer;
}

export interface Ack {
  size: number;
  error: number;
}

function createBaseImageData(): ImageData {
  return { timestamp: 0, image: Buffer.alloc(0) };
}

export const ImageData: MessageFns<ImageData> = {
  encode(message: ImageData, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.timestamp !== 0) {
      writer.uint32(8).uint64(message.timestamp);
    }
    if (message.image.length !== 0) {
      writer.uint32(18).bytes(message.image);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ImageData {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseImageData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.timestamp = longToNumber(reader.uint64());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.image = Buffer.from(reader.bytes());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ImageData {
    return {
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
      image: isSet(object.image) ? Buffer.from(bytesFromBase64(object.image)) : Buffer.alloc(0),
    };
  },

  toJSON(message: ImageData): unknown {
    const obj: any = {};
    if (message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    if (message.image.length !== 0) {
      obj.image = base64FromBytes(message.image);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ImageData>, I>>(base?: I): ImageData {
    return ImageData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ImageData>, I>>(object: I): ImageData {
    const message = createBaseImageData();
    message.timestamp = object.timestamp ?? 0;
    message.image = object.image ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseAck(): Ack {
  return { size: 0, error: 0 };
}

export const Ack: MessageFns<Ack> = {
  encode(message: Ack, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.size !== 0) {
      writer.uint32(8).uint32(message.size);
    }
    if (message.error !== 0) {
      writer.uint32(16).int32(message.error);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Ack {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAck();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.size = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.error = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Ack {
    return {
      size: isSet(object.size) ? globalThis.Number(object.size) : 0,
      error: isSet(object.error) ? globalThis.Number(object.error) : 0,
    };
  },

  toJSON(message: Ack): unknown {
    const obj: any = {};
    if (message.size !== 0) {
      obj.size = Math.round(message.size);
    }
    if (message.error !== 0) {
      obj.error = Math.round(message.error);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Ack>, I>>(base?: I): Ack {
    return Ack.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Ack>, I>>(object: I): Ack {
    const message = createBaseAck();
    message.size = object.size ?? 0;
    message.error = object.error ?? 0;
    return message;
  },
};

export type ImageTransferService = typeof ImageTransferService;
export const ImageTransferService = {
  transferImages: {
    path: "/image_transfer.ImageTransfer/TransferImages",
    requestStream: true,
    responseStream: true,
    requestSerialize: (value: ImageData) => Buffer.from(ImageData.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ImageData.decode(value),
    responseSerialize: (value: Ack) => Buffer.from(Ack.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Ack.decode(value),
  },
} as const;

export interface ImageTransferServer extends UntypedServiceImplementation {
  transferImages: handleBidiStreamingCall<ImageData, Ack>;
}

export interface ImageTransferClient extends Client {
  transferImages(): ClientDuplexStream<ImageData, Ack>;
  transferImages(options: Partial<CallOptions>): ClientDuplexStream<ImageData, Ack>;
  transferImages(metadata: Metadata, options?: Partial<CallOptions>): ClientDuplexStream<ImageData, Ack>;
}

export const ImageTransferClient = makeGenericClientConstructor(
  ImageTransferService,
  "image_transfer.ImageTransfer",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): ImageTransferClient;
  service: typeof ImageTransferService;
  serviceName: string;
};

function bytesFromBase64(b64: string): Uint8Array {
  return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
}

function base64FromBytes(arr: Uint8Array): string {
  return globalThis.Buffer.from(arr).toString("base64");
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(int64: { toString(): string }): number {
  const num = globalThis.Number(int64.toString());
  if (num > globalThis.Number.MAX_SAFE_INTEGER) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (num < globalThis.Number.MIN_SAFE_INTEGER) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
  }
  return num;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}

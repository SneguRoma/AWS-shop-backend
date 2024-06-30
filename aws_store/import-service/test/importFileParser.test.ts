
import { S3Handler } from "aws-lambda";
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import * as csv from "csv-parser";
import { Readable } from "stream";
import { importFileParser } from "../lambda/importFileParser";

const s3Mock = mockClient(S3Client);

describe("importFileParser", () => {
  beforeEach(() => {
    s3Mock.reset();
  });

  it("should parse and process the uploaded file", async () => {
    const event = {
      Records: [
        {
          s3: {
            bucket: { name: "my-bucket" },
            object: { key: "uploaded/test.csv" },
          },
        },
      ],
    };

    const stream = new Readable();
    stream._read = () => {};
    stream.push("name,age\nJohn,30\nJane,25");
    stream.push(null);

    s3Mock.on(GetObjectCommand).resolves({ Body: stream as Readable });

    console.log = jest.fn();

    await importFileParser(event as any, {} as any, {} as any);

    expect(console.log).toHaveBeenCalledWith("Parsed data:", {
      name: "John",
      age: "30",
    });
    expect(console.log).toHaveBeenCalledWith("Parsed data:", {
      name: "Jane",
      age: "25",
    });
    expect(console.log).toHaveBeenCalledWith("File parsed successfully");
  });

  it("should handle errors gracefully", async () => {
    const event = {
      Records: [
        {
          s3: {
            bucket: { name: "my-bucket" },
            object: { key: "uploaded/test.csv" },
          },
        },
      ],
    };

    s3Mock.on(GetObjectCommand).rejects(new Error("Error"));

    console.error = jest.fn();

    await importFileParser(event as any, {} as any, {} as any);

    expect(console.error).toHaveBeenCalledWith(
      "Error parsing file:",
      new Error("Error")
    );
  });
});

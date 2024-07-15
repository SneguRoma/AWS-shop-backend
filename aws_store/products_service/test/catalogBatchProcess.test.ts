import { catalogBatchProcess } from "../lambda/catalogBatchProcess";
import { createProductByBody } from "../lambda/helpers";

jest.mock("../lambda/helpers");

const mockEvent = {
  Records: [
    {
      body: JSON.stringify({
        title: "Test Product",
        description: "Test Description",
        price: 10,
        count: 5,
      }),
    },
  ],
};

describe("catalogBatchProcess", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process records successfully", async () => {
    
    (createProductByBody as jest.Mock).mockResolvedValueOnce(undefined);

    
    const mockContext = {} as any;
    const mockCallback = jest.fn();

    await catalogBatchProcess(mockEvent as any, mockContext, mockCallback);

    expect(createProductByBody).toHaveBeenCalledTimes(1);
    expect(createProductByBody).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Product",
        description: "Test Description",
        price: 10,
        count: 5,
      }),
      expect.any(String), 
      expect.any(String) 
    );

   
    expect(console.log).toHaveBeenCalledWith(
      "Publishing message:",
      expect.objectContaining({
        Subject: "New product created",
        Message: JSON.stringify({ product: mockEvent.Records[0].body }),
        TopicArn: expect.any(String),
      })
    );

   
    expect(mockCallback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      body: "Success",
    });
  });

  it("should handle errors during processing", async () => {
    
    const mockError = new Error("Test error");
    (createProductByBody as jest.Mock).mockRejectedValueOnce(mockError);

   
    const mockContext = {} as any;
    const mockCallback = jest.fn();

    await catalogBatchProcess(mockEvent as any, mockContext, mockCallback);

    expect(createProductByBody).toHaveBeenCalledTimes(1);
    expect(createProductByBody).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Product",
        description: "Test Description",
        price: 10,
        count: 5,
      }),
      expect.any(String), 
      expect.any(String) 
    );

    
    expect(console.error).toHaveBeenCalledWith(
      "Error processing SQS message",
      mockError
    );

    
    expect(mockCallback).toHaveBeenCalledWith(mockError);
  });
});

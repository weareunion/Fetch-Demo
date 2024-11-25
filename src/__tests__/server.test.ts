import request from "supertest";
import express from "express";
import receiptsRouter from "../models/receipts/model";
import dotenv from "dotenv";
import db, { DB } from "../_demo/DB";
import { ProcessedReceipt } from "../models/receipts/_types/Reciept";
import { app, server } from "../entry";

dotenv.config();

jest.mock("../_demo/DB", () => ({
  getReceipt: jest.fn(),
  updateReceipt: jest.fn(),
  storeReceipt: jest.fn((receipt: ProcessedReceipt): string => {
    return "generated-receipt-id";
  }),
}));

const mockedDb = db as jest.Mocked<DB>;

describe("Server Endpoints", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET /ping", () => {
    it("should respond with 'pong'", async () => {
      const response = await request(app).get("/ping");
      expect(response.status).toBe(200);
      expect(response.text).toBe("pong");
    });
  });

  describe("GET /receipts/:id", () => {
    it("should return a receipt when a valid ID is provided", async () => {
      const mockReceipt: ProcessedReceipt = {
        retailer: "Target",
        purchaseDate: new Date("2022-01-01"),
        purchaseTime: "13:01",
        items: [
          { shortDescription: "Mountain Dew 12PK", price: 6.49 },
          { shortDescription: "Emils Cheese Pizza", price: 12.25 },
          { shortDescription: "Knorr Creamy Chicken", price: 1.26 },
          { shortDescription: "Doritos Nacho Cheese", price: 3.35 },
          { shortDescription: "Klarbrunn 12-PK 12 FL OZ", price: 12.0 },
        ],
        total: 35.35,
        points: 28,
      };

      // Mock the getReceipt to return a valid receipt
      mockedDb.getReceipt.mockReturnValue(mockReceipt);

      const response = await request(app).get("/receipts/88115139-a0a0-41b7-9e6b-27cc21962a52");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...mockReceipt,
        purchaseDate: "2022-01-01T00:00:00.000Z",
      });
    });

    it("should return 404 when receipt is not found", async () => {
      // Mock the getReceipt to return undefined
      mockedDb.getReceipt.mockReturnValue(undefined);

      const response = await request(app).get("/receipts/non-existent-id");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Receipt not found" });
    });

    it("should handle server errors gracefully", async () => {
      // Mock the getReceipt to throw an error
      mockedDb.getReceipt.mockImplementation(() => {
        throw new Error("Database error");
      });

      const response = await request(app).get("/receipts/88115139-a0a0-41b7-9e6b-27cc21962a52");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("GET /receipts/:id/points", () => {
    it("should return points for a valid receipt ID", async () => {
      const mockProcessedReceipt: ProcessedReceipt = {
        retailer: "Target",
        purchaseDate: new Date("2022-01-01"),
        purchaseTime: "13:01",
        items: [
          { shortDescription: "Mountain Dew 12PK", price: 6.49 },
          { shortDescription: "Emils Cheese Pizza", price: 12.25 },
          { shortDescription: "Knorr Creamy Chicken", price: 1.26 },
          { shortDescription: "Doritos Nacho Cheese", price: 3.35 },
          { shortDescription: "Klarbrunn 12-PK 12 FL OZ", price: 12.0 },
        ],
        total: 35.35,
        points: 28,
      };

      // Mock the getReceipt to return a processed receipt
      mockedDb.getReceipt.mockReturnValue(mockProcessedReceipt);
      mockedDb.updateReceipt.mockReturnValue(true);

      const response = await request(app).get("/receipts/88115139-a0a0-41b7-9e6b-27cc21962a52/points");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ points: 28 });
      expect(mockedDb.updateReceipt).not.toHaveBeenCalled();
    });

    it("should calculate and update points if not already present", async () => {
      const mockReceipt: Partial<ProcessedReceipt> = {
        retailer: "Target",
        purchaseDate: new Date("2022-01-01"),
        purchaseTime: "13:01",
        items: [
          { shortDescription: "Mountain Dew 12PK", price: 6.49 },
          { shortDescription: "Emils Cheese Pizza", price: 12.25 },
          { shortDescription: "Knorr Creamy Chicken", price: 1.26 },
          { shortDescription: "Doritos Nacho Cheese", price: 3.35 },
          { shortDescription: "Klarbrunn 12-PK 12 FL OZ", price: 12.0 },
        ],
        total: 35.35,
      };

      // Mock the getReceipt to return a receipt without points
      mockedDb.getReceipt.mockReturnValue(mockReceipt as ProcessedReceipt);

      const response = await request(app).get("/receipts/88115139-a0a0-41b7-9e6b-27cc21962a52/points");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ points: 28 });
      expect(mockedDb.updateReceipt).toHaveBeenCalledWith(
        "88115139-a0a0-41b7-9e6b-27cc21962a52",
        expect.objectContaining({ points: 28 })
      );
    });

    it("should return 404 when receipt for points is not found", async () => {
      // Mock the getReceipt to return undefined
      mockedDb.getReceipt.mockReturnValue(undefined);

      const response = await request(app).get("/receipts/non-existent-id/points");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Receipt not found" });
    });

    it("should handle server errors gracefully when retrieving points", async () => {
      // Mock the getReceipt to throw an error
      mockedDb.getReceipt.mockImplementation(() => {
        throw new Error("Database error");
      });

      const response = await request(app).get("/receipts/88115139-a0a0-41b7-9e6b-27cc21962a52/points");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("POST /receipts/process", () => {
    it("should process and store a receipt", async () => {
      const newReceipt = {
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [
          { shortDescription: "Mountain Dew 12PK", price: 6.49 },
          { shortDescription: "Emils Cheese Pizza", price: 12.25 },
          { shortDescription: "Knorr Creamy Chicken", price: 1.26 },
          { shortDescription: "Doritos Nacho Cheese", price: 3.35 },
          { shortDescription: "Klarbrunn 12-PK 12 FL OZ", price: 12.0 },
        ],
        total: 35.35,
      };

      mockedDb.storeReceipt.mockReturnValue();

      const response = await request(app)
        .post("/receipts/process")
        .send(newReceipt)
        .set("Content-Type", "application/json");

      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(response.status).toBe(200);
    });

    it("should handle server errors gracefully when processing receipt", async () => {
      const newReceipt = {
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [
          { shortDescription: "Mountain Dew 12PK", price: 6.49 },
          { shortDescription: "Emils Cheese Pizza", price: 12.25 },
          { shortDescription: "Knorr Creamy Chicken", price: 1.26 },
          { shortDescription: "Doritos Nacho Cheese", price: 3.35 },
          { shortDescription: "Klarbrunn 12-PK 12 FL OZ", price: 12.0 },
        ],
        total: 35.35,
      };

      // Mock the storeReceipt method to throw an error
      mockedDb.storeReceipt.mockImplementation(() => {
        throw new Error("Database error");
      });

      const response = await request(app)
        .post("/receipts/process")
        .send(newReceipt)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });

  // Stop server after all tests are done
  afterAll(() => {
    server.close();
  });
}); 
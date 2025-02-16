import { TelexResponse } from "../types";
import { StorageService } from "./storageService";

export class TelexService {
  private storage: StorageService;
  private readonly MESSAGE_LIMIT = 50; // Keep last 50 messages for context
  private readonly TELEX_RETURN_URL = "https://ping.telex.im/v1/return";

  constructor(storage: StorageService) {
    this.storage = storage;
  }

  async sendTelexResponse(channelId: string, message: string): Promise<void> {
    const response: TelexResponse = {
      event_name: "message_formatted",
      message,
      status: "success",
      username: "AI Assistant",
    };

    try {
      const url = `${this.TELEX_RETURN_URL}/${channelId}`;
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      if (!result.ok) {
        throw new Error(
          `Failed to send response to Telex: ${result.statusText}`
        );
      }
    } catch (error) {
      console.error("Error sending response to Telex:", error);
      throw error;
    }
  }
}

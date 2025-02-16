const url = "https://5lldpsml-3000.uks1.devtunnels.ms";

export const telexGeneratedConfig = {
  data: {
    date: {
      created_at: "2024-03-21",
      updated_at: "2024-03-21",
    },
    integration_category: "modifier",
    integration_type: "modifier",
    descriptions: {
      app_name: "AI CHAT FOR TELEX CHANNELS",
      app_description:
        "An AI-powered assistant that automatically responds to messages and answers questions using the channel's conversation history as context.",
      app_logo:
        "https://res.cloudinary.com/devsource/image/upload/v1737510989/pngtree-no-cursing-sign-png-image_6610915_meqkww.png",
      app_url: url,
      background_color: "#4A90E2",
    },
    target_url: `${url}/webhook`,
    key_features: [
      "Automatic AI responses to channel messages",
      "Uses conversation history as context for intelligent responses",
      "Powered by Google's Gemini AI for natural language understanding",
      "Maintains context of up to 50 recent messages",
      "Real-time message processing and response generation",
    ],
    settings: [
      {
        label: "responseThreshold",
        type: "number",
        description:
          "Minimum confidence score (0-100) required for AI to respond",
        default: 70,
        required: true,
      },
      {
        label: "contextDepth",
        type: "number",
        description: "Number of recent messages to use for context (max 50)",
        default: 10,
        required: false,
      },
      {
        label: "aiPersonality",
        type: "select",
        description: "The personality style for AI responses",
        default: "helpful",
        options: ["helpful", "concise", "friendly", "professional"],
        required: false,
      },
    ],
    endpoints: [
      {
        path: "/webhook",
        method: "POST",
        description: "Receives messages and returns AI-generated responses",
      },
      {
        path: "/health",
        method: "GET",
        description: "Health check endpoint",
      },
    ],
    is_active: true,
    author: "JC CODER",
    version: "1.0.0",
  },
};

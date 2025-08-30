// API client for Kabaddi Analytics backend
// Handles communication with the FastAPI server integrated in main.py

// Centralized API configuration resolution
const API_CONFIG = (() => {
  // If explicitly provided via env, always prefer it
  const explicit = process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim();
  if (explicit) return explicit;

  // Default: localhost in development, empty in production to force explicit config
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  return '';
})();

// Application configuration
const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Kabaddi Guru Analytics',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  apiUrl: API_CONFIG
};

class ApiClient {
  constructor() {
    this.baseURL = APP_CONFIG.apiUrl;
    this.appConfig = APP_CONFIG;
    this.requestCache = new Map();
    this.pendingRequests = new Map();
    // Removed timeout to prevent request abortion
    
    // Log configuration in debug mode
    if (this.appConfig.debugMode) {
      console.log('🔧 API Client Configuration:', {
        baseURL: this.baseURL,
        appName: this.appConfig.name,
        version: this.appConfig.version,
        debugMode: this.appConfig.debugMode
      });
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || '')}`;
    
    console.log(`🔍 API Request: ${options.method || 'GET'} ${url}`);
    console.log(`🔍 Request body:`, options.body);
    
    // Check cache for GET requests
    if (options.method === 'GET' && this.requestCache.has(cacheKey)) {
      const cached = this.requestCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 60000) { // 1 minute cache
        console.log(`🚀 Using cached response for ${url}`);
        return cached.data;
      }
    }
    
    // Check for pending requests to avoid duplicates
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`🔄 Using pending request for ${url}`);
      return this.pendingRequests.get(cacheKey);
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log(`🔍 Request config:`, config);

    // Removed timeout to prevent request abortion
    // const controller = new AbortController();
    // const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
    // config.signal = controller.signal;

    const requestPromise = (async () => {
      try {
        console.log(`🚀 Making fetch request to ${url}`);
        let response;
        try {
          response = await fetch(url, config);
        } catch (networkError) {
          console.error('🌐 Network error while fetching API:', networkError);
          throw new Error(`Network error: Unable to reach backend at ${this.baseURL}. Ensure the server is running and CORS allows this origin.`);
        }
        // clearTimeout(timeoutId); // Removed timeout
        
        console.log(`🔍 Response status: ${response.status}`);
        console.log(`🔍 Response headers:`, response.headers);
        
        if (!response.ok) {
          const contentType = response.headers.get('content-type') || '';
          let errorBody = '';
          try {
            if (contentType.includes('application/json')) {
              const json = await response.json();
              errorBody = JSON.stringify(json);
            } else {
              errorBody = await response.text();
            }
          } catch (_) {}
          console.error(`❌ HTTP error! status: ${response.status}, body: ${errorBody}`);
          throw new Error(`HTTP error ${response.status}: ${errorBody || 'No response body'}`);
        }
        
        const data = await response.json();
        console.log(`✅ Response data:`, data);
        
        // Cache GET requests
        if (options.method === 'GET') {
          this.requestCache.set(cacheKey, {
            data,
            timestamp: Date.now()
          });
        }
        
        return data;
      } catch (error) {
        // clearTimeout(timeoutId); // Removed timeout
        console.error('❌ API request failed:', error);
        console.error('❌ Error details:', {
          message: error.message,
          stack: error.stack,
          type: error.constructor.name
        });
        throw error;
      } finally {
        this.pendingRequests.delete(cacheKey);
      }
    })();

    // Store pending request
    this.pendingRequests.set(cacheKey, requestPromise);
    
    return requestPromise;
  }

  // Chat endpoint
  async sendMessage(message, chatId = null, token = null) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const requestBody = {
      message,
      chat_id: chatId,
    };
    
    return this.request('/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });
  }

  // Get AI-generated suggestions (optionally team-focused)
  async getSuggestions(team) {
    // Add a longer cache time for suggestions to prevent frequent requests
    const endpoint = team ? `/suggestions?team=${encodeURIComponent(team)}` : '/suggestions';
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `GET:${url}:`;
    
    // Check cache with longer expiration (5 minutes)
    if (this.requestCache.has(cacheKey)) {
      const cached = this.requestCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        console.log(`🚀 Using cached suggestions response`);
        return cached.data;
      }
    }
    
    return this.request(endpoint);
  }

  // Get performance statistics
  async getStats() {
    return this.request('/stats');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Generate conversation summary
  async generateSummary(chatId) {
    return this.request('/summary', {
      method: 'POST',
      body: JSON.stringify({
        chat_id: chatId,
      }),
    });
  }

  // Submit feedback
  async submitFeedback(feedbackData) {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

// Export individual functions for convenience
export const sendMessage = (message, chatId, token) => apiClient.sendMessage(message, chatId, token);
export const getSuggestions = (team) => apiClient.getSuggestions(team);
export const getStats = () => apiClient.getStats();
export const healthCheck = () => apiClient.healthCheck();
export const generateSummary = (chatId) => apiClient.generateSummary(chatId);
export const submitFeedback = (feedbackData) => apiClient.submitFeedback(feedbackData);

export default apiClient;

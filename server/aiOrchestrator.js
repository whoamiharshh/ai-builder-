// AI Orchestration System with multiple providers and failover
import axios from 'axios';

const AI_PROVIDERS = {
  OPENROUTER: {
    name: 'OpenRouter',
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: 'https://api.openrouter.ai/v1',
    models: ['gpt-4o-mini', 'claude-3-5-sonnet', 'gemini-2.0-flash'],
    priority: 1,
  },
  GEMINI: {
    name: 'Google Gemini',
    apiKey: process.env.GEMINI_API_KEY,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    models: ['gemini-2.0-flash', 'gemini-pro-vision'],
    priority: 2,
  },
};

const IMAGE_PROVIDERS = {
  FLUX: {
    name: 'Flux',
    apiKey: process.env.FLUX_API_KEY,
    priority: 1,
    quality: 'ultra',
  },
  STABLE_DIFFUSION: {
    name: 'Stable Diffusion XL',
    apiKey: process.env.STABLE_DIFFUSION_API_KEY,
    priority: 2,
    quality: 'high',
  },
};

class AIOrchestrator {
  constructor() {
    this.requestQueue = [];
    this.isProcessing = false;
    this.cache = new Map();
  }

  // Generate text with AI fallback
  async generateText(prompt, options = {}) {
    const cacheKey = `text_${prompt}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const providers = this.getSortedProviders(AI_PROVIDERS);
    
    for (const provider of providers) {
      try {
        let result;
        if (provider.name === 'OpenRouter') {
          result = await this.generateViaOpenRouter(prompt, options);
        } else if (provider.name === 'Google Gemini') {
          result = await this.generateViaGemini(prompt, options);
        }
        
        this.cache.set(cacheKey, result);
        return result;
      } catch (error) {
        console.error(`${provider.name} failed:`, error.message);
        continue;
      }
    }

    throw new Error('All AI providers failed');
  }

  // Generate images with fallback
  async generateImage(prompt, options = {}) {
    const imageProviders = this.getSortedProviders(IMAGE_PROVIDERS);
    
    for (const provider of imageProviders) {
      try {
        let result;
        if (provider.name === 'Flux') {
          result = await this.generateViaFlux(prompt, options);
        } else if (provider.name === 'Stable Diffusion XL') {
          result = await this.generateViaStableDiffusion(prompt, options);
        }
        return result;
      } catch (error) {
        console.error(`${provider.name} failed:`, error.message);
        continue;
      }
    }

    throw new Error('All image providers failed');
  }

  // OpenRouter API call
  async generateViaOpenRouter(prompt, options = {}) {
    const payload = {
      model: options.model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are SyntheticAI, a premium AI product strategist and business builder.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
    };

    const response = await axios.post(
      `${AI_PROVIDERS.OPENROUTER.baseUrl}/chat/completions`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${AI_PROVIDERS.OPENROUTER.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return {
      content: response.data.choices[0].message.content,
      tokens: response.data.usage.total_tokens,
      provider: 'OpenRouter',
    };
  }

  // Gemini API call
  async generateViaGemini(prompt, options = {}) {
    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 2000,
      },
    };

    const response = await axios.post(
      `${AI_PROVIDERS.GEMINI.baseUrl}/gemini-2.0-flash:generateContent`,
      payload,
      {
        params: { key: AI_PROVIDERS.GEMINI.apiKey },
        timeout: 30000,
      }
    );

    return {
      content: response.data.candidates[0].content.parts[0].text,
      tokens: response.data.usageMetadata.totalTokenCount,
      provider: 'Gemini',
    };
  }

  // Flux image generation
  async generateViaFlux(prompt, options = {}) {
    const payload = {
      prompt: prompt,
      num_images: options.numImages || 1,
      image_size: options.imageSize || '1024x1024',
      steps: options.steps || 20,
      guidance: options.guidance || 7.5,
    };

    const response = await axios.post(
      'https://api.bfl.ml/v1/flux-pro-1.0',
      payload,
      {
        headers: {
          'x-key': IMAGE_PROVIDERS.FLUX.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return {
      imageUrls: response.data.images || response.data.result.images,
      provider: 'Flux',
      quality: 'ultra',
    };
  }

  // Stable Diffusion generation
  async generateViaStableDiffusion(prompt, options = {}) {
    const payload = {
      prompt: prompt,
      negative_prompt: options.negativePrompt || '',
      num_images_per_prompt: options.numImages || 1,
      guidance_scale: options.guidance || 7.5,
      num_inference_steps: options.steps || 20,
    };

    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      payload,
      {
        headers: {
          Authorization: `Bearer ${IMAGE_PROVIDERS.STABLE_DIFFUSION.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return {
      imageUrls: response.data.artifacts.map((a) => a.base64),
      provider: 'Stable Diffusion',
      quality: 'high',
    };
  }

  // Queue management
  async queueGeneration(task) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;
    const { task, resolve, reject } = this.requestQueue.shift();

    try {
      const result = await (task.type === 'text'
        ? this.generateText(task.prompt, task.options)
        : this.generateImage(task.prompt, task.options));
      resolve(result);
    } catch (error) {
      reject(error);
    }

    this.isProcessing = false;
    this.processQueue();
  }

  // Utility methods
  getSortedProviders(providers) {
    return Object.values(providers).sort((a, b) => a.priority - b.priority);
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: 1000,
    };
  }
}

export const orchestrator = new AIOrchestrator();

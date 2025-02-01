import fs from 'fs';
import path from 'path';

import os from 'os';
import type { Config, ModelConfig } from '../types';

export class ConfigManager {
  private configPath: string;
  private config: Config;

  constructor() {
    this.configPath = path.join(os.homedir(), '.one.json');
    this.config = this.loadConfig();
  }


  private loadConfig(): Config {
    const defaultConfig: Config = {
      models: {
        openai: {
          apiKey: process.env.OPENAI_API_KEY,
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 1000
        },
        anthropic: {
          apiKey: process.env.ANTHROPIC_API_KEY,
          model: 'claude-3-sonnet-20240229',
          temperature: 0.7,
          maxTokens: 1000
        }
      },
      defaultModel: 'openai'
    };

    try {
      if (fs.existsSync(this.configPath)) {
        const fileConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
        return { ...defaultConfig, ...fileConfig };
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }

    return defaultConfig;
  }

  public saveConfig(): void {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Error saving config');
    }
  }

  public getModelConfig(name: string): ModelConfig {
    return this.config.models[name] || {};
  }
  public setModelConfig(name: string, config: ModelConfig): void {
    this.config.models[name] = {
      ...this.config.models[name],
      ...config
    }
    this.saveConfig();
  }
  public setDefaultModel(name: string): void {
    this.config.defaultModel = name;
    this.saveConfig();
  }
  public getDefaultModel(): string {
    return this.config.defaultModel;
  }
  
}

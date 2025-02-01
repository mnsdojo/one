export interface AIModel {
  generate(prompt: string): Promise<string>;
  name: string;
}
export interface Command {
  description: string; // Description of the command
  execute(args: string[]): Promise<void>; // Method to execute the command
}
export interface ModelConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface Config {
  models: {
    [key: string]: ModelConfig;
  };
  defaultModel: string;
}

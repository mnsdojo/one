import { ConfigManager } from "../config";
import type { Command } from "../types";
import chalk from "chalk";

export class ConfigCommand implements Command {
  async execute(args: string[]): Promise<void> {
    if (args.length < 1) {
      this.showHelp();
      return Promise.resolve();
    }
    const [action, ...rest] = args;
    switch (action) {
      case "set":
        await this.setConfig(rest);
        break;
      case "get":
        break;
      case "default":
        await this.setDefault(rest);
        break;
      default:
        console.log(chalk.red("Invalid action"));
        this.showHelp();
    }
  }
  description: string = "Manage Configuration settings";

  constructor(private configManager: ConfigManager) {}
  private showHelp(): void {
    console.log(chalk.bold("\nConfig Commands:"));
    console.log("  set <model> <key> <value>  Set configuration value");
    console.log("  get <model>               Show model configuration");
    console.log("  default <model>           Set default model\n");
    console.log(chalk.bold("Examples:"));
    console.log('  one config set openai apiKey "your-api-key"');
    console.log("  one config set openai temperature 0.8");
    console.log("  one config get openai");
    console.log("  one config default anthropic\n");
  }

  private async setConfig(args: string[]): Promise<void> {
    if (args.length !== 3) {
      console.log(chalk.red("Invalid number of arguments"));
      return;
    }
    const [model, key, value] = args;
    const configManager = new ConfigManager();
    const modelConfig = configManager.getModelConfig(model);
    const parsedValue = !isNaN(Number(value)) ? Number(value) : value;
    this.configManager.setModelConfig(model, {
      ...modelConfig,
      [key]: parsedValue,
    });
    console.log(chalk.green(`Configuration set for ${model}`));
  }
  private async setDefault(args: string[]): Promise<void> {
    if (args.length !== 1) {
      console.log(chalk.red("Invalid number of arguments"));
      return;
    }

    const [model] = args;
    this.configManager.setDefaultModel(model);
    console.log(chalk.green(`Default model set to ${model}`));
  }
}

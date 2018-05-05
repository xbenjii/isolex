import { isNumber } from 'lodash';
import * as mathjs from 'mathjs';
import { Logger } from 'noicejs/logger/Logger';
import { Bot } from 'src/Bot';
import { Command } from 'src/Command';
import { Handler, HandlerOptions } from 'src/handler/Handler';
import { Message } from 'src/Message';
import { isObject } from 'util';

export interface MathHandlerConfig {
  matrix: string;
  name: string;
  number: string;
}

export interface MathHandlerOptions extends HandlerOptions<MathHandlerConfig> {
  /* empty */
}

export class MathHandler implements Handler {
  protected bot: Bot;
  protected config: MathHandlerConfig;
  protected logger: Logger;
  protected math: mathjs.MathJsStatic;
  protected name: string;

  constructor(options: MathHandlerOptions) {
    this.bot = options.bot;
    this.logger = options.logger.child({
      class: MathHandler.name
    });
    this.math = (mathjs as any).create(options.config);
    this.name = options.config.name;
  }

  public async handle(cmd: Command): Promise<boolean> {
    if (cmd.name !== this.name) {
      return false;
    }

    this.logger.debug({ cmd }, 'calculating command');

    const args = cmd.get('args');
    if (!args || !args.length) {
      throw new Error('');
    }

    for (const expr of args) {
      const body = this.eval(expr, { cmd });
      this.logger.debug({ body, expr }, 'compiled expression');

      const msg = new Message({
        body,
        context: cmd.context,
        reactions: []
      });
      await this.bot.send(msg);
    }

    return true;
  }

  protected eval(expr: string, scope: any): string {
    const body = this.math.eval(expr, scope);

    if (isNumber(body)) {
      return body.toString();
    }

    switch (mathjs.typeof(body)) {
      case 'null':
        return 'null';
      case 'boolean':
      case 'number':
      case 'string':
        return String(body);
      case 'Date':
        return body.toString();
      case 'Array':
        return body.join(',');
      case 'Function':
        return body.call(this, scope);
      case 'Object':
        return JSON.stringify(body);
      case 'RegExp':
        return 'regexp';
      case 'undefined':
        return 'undefined';
      case 'BigNumber':
      case 'Complex':
      case 'Fraction':
      case 'Matrix':
      case 'Range':
      case 'Unit':
        return mathjs.format(body);
      default:
        return `unknown result type: ${JSON.stringify(body)}`;
    }
  }
}
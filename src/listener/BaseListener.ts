import { BaseService } from 'src/BaseService';
import { Context } from 'src/entity/Context';
import { Message } from 'src/entity/Message';
import { FetchOptions, Listener } from 'src/listener/Listener';
import { ServiceConfig } from 'src/Service';

export abstract class BaseListener<TConfig extends ServiceConfig> extends BaseService<TConfig> implements Listener {
  /**
   * @TODO implement this for real
   */
  public async check(context: Context): Promise<boolean> {
    return true;
  }

  public abstract emit(msg: Message): Promise<void>;

  public abstract fetch(options: FetchOptions): Promise<Array<Message>>;

  public abstract receive(event: any): Promise<void>;

  public abstract start(): Promise<void>;

  public abstract stop(): Promise<void>;
}

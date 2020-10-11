import { injectable, inject } from "tsyringe";
import { classToClass } from "class-transformer";

import User from "@modules/users/infra/typeorm/entities/User";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import { AdvancedConsoleLogger } from "typeorm";

@injectable()
class ListProvidersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute(provider_id?: string): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${provider_id}`
    );

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: provider_id,
      });

      await this.cacheProvider.save(
        `providers-list:${provider_id}`,
        classToClass(users)
      );
    }

    return users;
  }
}

export default ListProvidersService;

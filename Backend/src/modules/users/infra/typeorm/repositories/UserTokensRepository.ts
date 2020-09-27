import { getRepository, Repository } from "typeorm";

import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";

import UserToken from "@modules/users/infra/typeorm/entities/UserToken";

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    return await this.ormRepository.save(userToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findUserToken = await this.ormRepository.findOne({
      where: { token },
    });

    return findUserToken;
  }
}

export default UserTokensRepository;

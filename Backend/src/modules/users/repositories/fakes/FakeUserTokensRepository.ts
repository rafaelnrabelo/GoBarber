import { v4 as uuid } from "uuid";

import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";

import UserToken from "@modules/users/infra/typeorm/entities/UserToken";

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findUserToken = this.userTokens.find(
      (userToken) => userToken.token === token
    );

    return findUserToken;
  }

  public async invalidate(token: string): Promise<void> {
    this.userTokens = this.userTokens.filter(
      (userToken) => userToken.token !== token
    );
  }
}

export default FakeUserTokensRepository;

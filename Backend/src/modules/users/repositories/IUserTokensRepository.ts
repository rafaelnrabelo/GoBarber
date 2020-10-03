import UserToken from "../infra/typeorm/entities/UserToken";

interface IUserTokensRepository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
  invalidate(token: string): Promise<void>;
}

export default IUserTokensRepository;

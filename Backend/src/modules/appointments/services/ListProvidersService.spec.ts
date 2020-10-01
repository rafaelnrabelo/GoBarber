import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import ListProvidersService from "./ListProvidersService";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe("ListProviders", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider
    );
  });

  it("should be able to list all providers", async () => {
    const user1 = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    const user2 = await fakeUsersRepository.create({
      name: "Test2",
      email: "test2@test.com",
      password: "123456",
    });

    const providers = await listProviders.execute();

    expect(providers.length).toBe(2);
    expect(providers).toEqual([user1, user2]);
  });

  it("should be able to list all providers from cache", async () => {
    const user1 = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    const user2 = await fakeUsersRepository.create({
      name: "Test2",
      email: "test2@test.com",
      password: "123456",
    });

    await listProviders.execute();
    const providers = await listProviders.execute();

    expect(providers.length).toBe(2);
    expect(providers).toEqual([user1, user2]);
  });

  it("should be able to list all providers except the one logged", async () => {
    const userLogged = await fakeUsersRepository.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    const user = await fakeUsersRepository.create({
      name: "Test2",
      email: "test2@test.com",
      password: "123456",
    });

    const providers = await listProviders.execute(userLogged.id);

    expect(providers.length).toBe(1);
    expect(providers).toEqual([user]);
  });
});

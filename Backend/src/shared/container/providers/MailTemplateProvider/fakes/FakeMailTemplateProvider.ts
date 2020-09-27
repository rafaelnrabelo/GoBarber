import IMailTemplateProvider from "../models/IMailTemplateProvider";
import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse({}: IParseMailTemplateDTO): Promise<string> {
    return "Template";
  }
}

export default FakeMailTemplateProvider;

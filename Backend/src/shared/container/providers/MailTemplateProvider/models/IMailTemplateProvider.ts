import { Provider } from "tsyringe";

import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";

interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}

export default IMailTemplateProvider;

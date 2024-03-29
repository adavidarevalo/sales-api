import handlebars from 'handlebars';
import fs from 'fs';

interface ITemplateVariable {
    [key: string]: string | number;
}

export interface IParseMailTemplate {
    file: string;
    variables: ITemplateVariable;
}

class HandlebarsMailTemplate {
    public async parse({
        file,
        variables,
    }: IParseMailTemplate): Promise<string> {
        const templateFileContent = await fs.promises.readFile(file, 'utf8');

        const parseTemplate = handlebars.compile(templateFileContent);

        return parseTemplate(variables);
    }
}

export default HandlebarsMailTemplate;

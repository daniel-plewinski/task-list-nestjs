import { IIndexProvider } from './index-provider.interface';
import * as fs from 'fs';

export class FileIndexProvider implements IIndexProvider {
  constructor(private readonly path: string) {}

  nextInt(): number {
    const lastId = fs.readFileSync(this.path, 'utf-8');
    const newId = parseInt(lastId, 10) + 1;
    fs.writeFileSync(this.path, newId.toString());
    return newId;
  }
}

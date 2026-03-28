import { FileIndexProvider } from '../../../src/infrastructure/providers/file-index.provider';
import * as fs from 'fs';
import * as path from 'path';

describe('FileIndexProvider', () => {
  let provider: FileIndexProvider;
  const indexPath = path.join(__dirname, 'test-index-provider.idx');

  beforeEach(() => {
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
    }
    provider = new FileIndexProvider(indexPath);
  });

  afterEach(() => {
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
    }
  });

  it('should return 1 when file contains 0', () => {
    fs.writeFileSync(indexPath, '0');
    const nextId = provider.nextInt();
    expect(nextId).toBe(1);
    expect(fs.readFileSync(indexPath, 'utf-8')).toBe('1');
  });

  it('should return incremented value', () => {
    fs.writeFileSync(indexPath, '5');
    const nextId = provider.nextInt();
    expect(nextId).toBe(6);
    expect(fs.readFileSync(indexPath, 'utf-8')).toBe('6');
  });

  it('should increment on each call', () => {
    fs.writeFileSync(indexPath, '0');
    const id1 = provider.nextInt();
    const id2 = provider.nextInt();
    const id3 = provider.nextInt();
    expect(id1).toBe(1);
    expect(id2).toBe(2);
    expect(id3).toBe(3);
    expect(fs.readFileSync(indexPath, 'utf-8')).toBe('3');
  });

  it('should handle string to number conversion', () => {
    fs.writeFileSync(indexPath, '10');
    const nextId = provider.nextInt();
    expect(nextId).toBe(11);
  });
});

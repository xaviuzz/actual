import fs from 'fs';
import os from 'os';
import path from 'path';

import { saveFile } from './saveFile';

describe('saveFile', () => {
  let directory: string;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'save-file-'));
  });

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true });
  });

  it('has written a text file by the time it resolves', async () => {
    const filePath = path.join(directory, 'report.csv');

    await saveFile(filePath, 'date,amount\n2026-01-01,10\n');

    const written = fs.readFileSync(filePath, 'utf8');
    expect(written).toBe('date,amount\n2026-01-01,10\n');
  });

  it('writes only the bytes of a buffer that views part of a larger memory block', async () => {
    const filePath = path.join(directory, 'export.zip');
    const pool = Buffer.alloc(64, 0xff);
    const zipBytes = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
    zipBytes.copy(pool, 16);
    const viewOfZip = pool.subarray(16, 20);

    await saveFile(filePath, viewOfZip);

    const written = fs.readFileSync(filePath);
    expect(written).toEqual(zipBytes);
  });
});

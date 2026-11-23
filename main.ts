import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_FILE_BYTES = 1_048_576;
const TARGET_SIZE = 1024;
const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_TRAILER = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);

function computeCrc32(chunkTypeAndData: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < chunkTypeAndData.length; i++) {
    crc ^= chunkTypeAndData[i]!;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 1) !== 0 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function verifyPngBuffer(buf: Buffer): { width: number; height: number; bytes: number; chunks: number } {
  if (buf.length < 45 || !buf.subarray(0, 8).equals(PNG_HEADER)) {
    throw new Error('Invalid PNG header signature in entry.png');
  }
  if (!buf.subarray(buf.length - 12).equals(PNG_TRAILER)) {
    throw new Error('Missing or corrupted PNG IEND trailer chunk in entry.png');
  }
  if (buf.length > MAX_FILE_BYTES) {
    throw new Error(`entry.png size (${buf.length} bytes) exceeds 1 MiB cap (${MAX_FILE_BYTES} bytes)`);
  }
  const ihdrType = buf.subarray(12, 16).toString('ascii');
  if (ihdrType !== 'IHDR') {
    throw new Error(`Expected first PNG chunk to be IHDR, got ${ihdrType}`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (width < 1 || height < 1 || width > TARGET_SIZE || height > TARGET_SIZE) {
    throw new Error(`Invalid PNG dimensions ${width}x${height}; must be within ${TARGET_SIZE}x${TARGET_SIZE}`);
  }

  let offset = 8;
  let chunks = 0;
  let sawIdat = false;
  let sawIend = false;
  while (offset < buf.length) {
    if (offset + 12 > buf.length) {
      throw new Error(`Truncated PNG chunk header at byte offset ${offset}`);
    }
    const length = buf.readUInt32BE(offset);
    const chunkEnd = offset + 12 + length;
    if (chunkEnd > buf.length) {
      throw new Error(`Truncated PNG chunk payload at byte offset ${offset}`);
    }
    const type = buf.subarray(offset + 4, offset + 8).toString('ascii');
    const expectedCrc = buf.readUInt32BE(offset + 8 + length);
    const actualCrc = computeCrc32(buf.subarray(offset + 4, offset + 8 + length));
    if (expectedCrc !== actualCrc) {
      throw new Error(`CRC32 mismatch in PNG chunk ${type} at offset ${offset}`);
    }
    if (type === 'IDAT') sawIdat = true;
    if (type === 'IEND') sawIend = true;
    chunks++;
    offset = chunkEnd;
  }
  if (!sawIdat || !sawIend) {
    throw new Error('PNG stream missing required IDAT or IEND chunk');
  }
  return { width, height, bytes: buf.length, chunks };
}

function run(): void {
  const repoRoot = dirname(fileURLToPath(import.meta.url));
  const inputPngPath = join(repoRoot, 'entry.png');
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const outPngPath = join(outDir, 'entry.png');

  const imageBytes = readFileSync(inputPngPath);
  verifyPngBuffer(imageBytes);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPngPath, imageBytes);
}

run();

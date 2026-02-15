import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import guestsJson from './guests.json' with {type: 'json'};

function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    crypto.createHash('sha256').update(key).digest(),
    iv
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return [
    iv.toString('hex'),
    cipher.getAuthTag().toString('hex'),
    encrypted
  ].join(':');
}

function createGuest(options: {
  name: string,
  id: number,
}) {
  return encrypt(
    JSON.stringify({
      name: options.name,
      location: 'Дубай, Бурдж Халифа',
      time: '14:30',
    }),
    options.id.toString()
  );
}

fs.writeFileSync(
  path.resolve(url.fileURLToPath(import.meta.url), '../../src/guests.json'),
  JSON.stringify(
    guestsJson.map(guest => createGuest({
      name: guest.name,
      id: guest.userId
    }))
  )
);

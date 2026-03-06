import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import infoJson from './info.json' with { type: 'json' };

function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    crypto.createHash('sha256').update(key)
      .digest(),
    iv,
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return [
    iv.toString('hex'),
    cipher.getAuthTag().toString('hex'),
    encrypted,
  ].join(':');
}

function createGuest(options: {
  name: string;
  userId: number;
  location: string;
  date: string;
  groupChatInviteLink: string;
  plusOne?: boolean;
}) {
  return encrypt(
    JSON.stringify({
      name: options.name,
      location: options.location,
      date: options.date,
      plusOne: options.plusOne,
      groupChatInviteLink: options.groupChatInviteLink,
    }),
    options.userId.toString(),
  );
}

fs.writeFileSync(
  path.resolve(import.meta.dirname, '../src/guests.json'),
  JSON.stringify(
    infoJson.guests.map(guest => createGuest({
      name: guest.name,
      userId: guest.userId,
      plusOne: guest.plusOne,
      location: infoJson.location,
      groupChatInviteLink: infoJson.groupChatInviteLink,
      date: infoJson.date,
    })),
  ),
);

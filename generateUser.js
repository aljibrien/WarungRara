// generate-user.js
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const username = 'admin';
const plainPassword = 'warungrara2002'; // Ganti dengan password yang kamu inginkan

async function generateUser() {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = {
    username,
    password: hashedPassword,
  };

  const filePath = path.join(process.cwd(), 'data', 'users.json');

  fs.writeFileSync(filePath, JSON.stringify([user], null, 2));
  console.log('✅ users.json berhasil dibuat dengan hash password.');
  console.log(`🔒 Username: ${username}`);
  console.log(`🔑 Password: ${plainPassword}`);
}

generateUser();

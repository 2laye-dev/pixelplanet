const fs=require('node:fs');const {randomBytes,scryptSync}=require('node:crypto');
if(fs.existsSync('.env.local')){console.log('Existing .env.local preserved.');process.exit(0);}
const password=randomBytes(18).toString('base64url');const salt=randomBytes(16).toString('hex');
fs.writeFileSync('.env.local',`ADMIN_USERNAME=admin\nADMIN_PASSWORD_HASH=${salt}:${scryptSync(password,salt,64).toString('hex')}\nSESSION_SECRET=${randomBytes(48).toString('hex')}\nSITE_URL=http://localhost:3000\nCOOKIE_SECURE=false\n`,{mode:0o600});
fs.writeFileSync('LOCAL-ACCESS.txt',`Local preview only\nURL: http://localhost:3000/admin\nUsername: admin\nPassword: ${password}\n\nNot included in deployment ZIP. Configure new credentials on the hosting server.\n`,{mode:0o600});console.log('Local access configured. Credentials saved in LOCAL-ACCESS.txt.');

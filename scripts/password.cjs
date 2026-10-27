const {scryptSync,randomBytes}=require('node:crypto');
const value=process.argv[2];if(!value||value.length<12){console.error('Use a password with at least 12 characters: npm run admin:password -- "your-password"');process.exit(1);}
const salt=randomBytes(16).toString('hex');console.log(`${salt}:${scryptSync(value,salt,64).toString('hex')}`);

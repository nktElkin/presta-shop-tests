
export function generateUniqueEmail(baseName: string = 'testuser', domain: string = 'test.com'): string {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${baseName}${timestamp}${randomNum}@${domain}`;
}

export type User = {
  gender: 'male' | 'female';
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: string;
};

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
function generateRandomStringChars(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateTestUser(lengthOfName: number = 8, gender: 'male' | 'female' = 'male'): User {
  const firstName = generateRandomStringChars(lengthOfName);
  const lastName = generateRandomStringChars(lengthOfName);
  return {
    gender,
    firstName,
    lastName,
    email: generateUniqueEmail(firstName.toLowerCase()),
    password: `${firstName.toUpperCase() + firstName.toLocaleLowerCase().slice(1)}_pw@test`,
    birthDate: '01.01.1990'
  };
}

// console.log(generateTestUser(8));

// "gender": "male",
//   "firstName": "EpkFIDSI",
//   "lastName": "UlpfOeRS",
//   "email": "epkfidsi1760558758327159@test.com",
//   "password": "EPKFIDSIpkfidsi_pw@test",
//   "birthDate": "01.01.1990"
// 



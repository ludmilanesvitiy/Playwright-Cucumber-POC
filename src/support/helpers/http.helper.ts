import { page } from '../common-hooks';

export function getAPIUrl () {
    if (!process.env.API_URL) {
        throw new Error('Please, specify API url correctly');
    } else {
        return process.env.API_URL;
    }
}

export function getUserCredentials (user: string) {
    switch (user) {
        case 'Individual':
            return process.env.USER_EMAIL1;

        case 'Business':
            return process.env.USER_EMAIL2;

        case 'Enterprise-User':
            return process.env.USER_EMAIL3;

        case 'Enterprise':
            return process.env.USER_EMAIL;

        case 'LS':
            return process.env.USER_EMAIL4;

        default:
            return process.env.USER_EMAIL1;
    }
}

export async function getToken (userEmail: string, userPass = process.env.USER_PASS) {
    try {
        const responseToken = await page.request.post(`${getAPIUrl()}/api/Auth/signin`, {
            data: {'username': userEmail, 'password': userPass},
        });
        return (await responseToken.json()).token;
    } catch (e) {
        await console.log('I\'ve tried to Login by API, but received an error: ' + e);
    }
}

export async function headersPostGenerateToken (user?: string, pass?: string) {
    const tokenRes = await getToken(user || process.env.USER_EMAIL, pass || process.env.USER_PASS);
    return {
        'accept': '*/*',
        'Content-Type': 'application/json-patch+json',
        'Authorization': `Bearer ${tokenRes}`,
    };
}

export async function headersPostGenerateTokenForFile (user?: string, pass?: string) {
    const tokenRes = await getToken(user || process.env.USER_EMAIL, pass || process.env.USER_PASS);
    return {
        'accept': '*/*',
        'ContentType': 'multipart/form-data',
        'Authorization': `Bearer ${tokenRes}`,
    };

}
export async function headersPostGenerateTokenForProductFile (user?: string, pass?: string) {
    const tokenRes = await getToken(user || process.env.USER_EMAIL, pass || process.env.USER_PASS);
    return {
        'accept': '*/*',
        'ContentType': 'text/plain',
        'Authorization': `Bearer ${tokenRes}`,
    };
}
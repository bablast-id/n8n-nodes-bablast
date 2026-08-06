"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BablastApi = void 0;
class BablastApi {
    name = 'bablastApi';
    displayName = 'Bablast API';
    documentationUrl = 'https://bablast.id';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'Your Bablast Sender or Account API Key',
        },
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: 'https://api.bablast.id/v2/openapi',
            required: true,
            description: 'Base URL of the Bablast API instance',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                'x-api-key': '={{$credentials.apiKey}}',
            },
        },
    };
}
exports.BablastApi = BablastApi;

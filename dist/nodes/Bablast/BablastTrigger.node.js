"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BablastTrigger = void 0;
const client_1 = require("@bablast/client");
class BablastTrigger {
    description = {
        displayName: 'Bablast Trigger',
        name: 'bablastTrigger',
        icon: 'file:Bablast.svg',
        group: ['trigger'],
        version: 1,
        description: 'Triggers a workflow when a WhatsApp message or status update is received from Bablast',
        defaults: {
            name: 'Bablast Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'bablastApi',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Sender ID / Device ID',
                name: 'senderId',
                type: 'string',
                required: true,
                default: '',
                placeholder: '123',
                description: 'The Bablast WhatsApp Sender ID to subscribe to',
            },
            {
                displayName: 'Channel Type',
                name: 'channelType',
                type: 'options',
                options: [
                    { name: 'WhatsApp Device (Blast)', value: 'blast' },
                    { name: 'Official WABA (Meta)', value: 'waba' },
                ],
                default: 'blast',
                description: 'Channel engine to listen for events',
            },
            {
                displayName: 'Subscribed Events',
                name: 'events',
                type: 'multiOptions',
                options: [
                    { name: 'Incoming Message', value: 'incoming_message', description: 'Trigger on new chat messages' },
                    { name: 'Message Status Update', value: 'message_status', description: 'Trigger on status updates (delivered/read/failed)' },
                ],
                default: ['incoming_message'],
                required: true,
            },
        ],
    };
    webhookMethods = {
        default: {
            async checkExists() {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const credentials = await this.getCredentials('bablastApi');
                const senderId = this.getNodeParameter('senderId');
                const channelType = this.getNodeParameter('channelType', 'blast');
                const client = new client_1.BablastClient({
                    apiKey: credentials.apiKey,
                    baseUrl: credentials.baseUrl,
                });
                try {
                    const config = await client.webhooks.getConfig(senderId, channelType);
                    return config?.is_active === true && config?.url === webhookUrl;
                }
                catch {
                    return false;
                }
            },
            async create() {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const credentials = await this.getCredentials('bablastApi');
                const senderId = this.getNodeParameter('senderId');
                const channelType = this.getNodeParameter('channelType', 'blast');
                const events = this.getNodeParameter('events');
                const client = new client_1.BablastClient({
                    apiKey: credentials.apiKey,
                    baseUrl: credentials.baseUrl,
                });
                await client.webhooks.updateConfig(senderId, {
                    url: webhookUrl,
                    is_active: true,
                    events,
                }, channelType);
                return true;
            },
            async delete() {
                const credentials = await this.getCredentials('bablastApi');
                const senderId = this.getNodeParameter('senderId');
                const channelType = this.getNodeParameter('channelType', 'blast');
                const client = new client_1.BablastClient({
                    apiKey: credentials.apiKey,
                    baseUrl: credentials.baseUrl,
                });
                try {
                    await client.webhooks.updateConfig(senderId, {
                        is_active: false,
                    }, channelType);
                }
                catch {
                    // Ignore deletion error if sender is gone
                }
                return true;
            },
        },
    };
    async webhook() {
        const req = this.getRequestObject();
        const body = req.body;
        const credentials = await this.getCredentials('bablastApi');
        const client = new client_1.BablastClient({
            apiKey: credentials.apiKey,
            baseUrl: credentials.baseUrl,
        });
        const parsedEvent = client.webhooks.parseEvent(body);
        return {
            workflowData: [this.helpers.returnJsonArray(parsedEvent)],
        };
    }
}
exports.BablastTrigger = BablastTrigger;

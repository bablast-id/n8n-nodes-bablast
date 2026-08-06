import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { BablastClient } from 'bablastid';

export class Bablast implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bablast',
    name: 'bablast',
    icon: 'file:Bablast.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Bablast WhatsApp Messaging & WABA API',
    defaults: {
      name: 'Bablast',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'bablastApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'WhatsApp Device', value: 'whatsapp' },
          { name: 'Official WABA', value: 'waba' },
          { name: 'Contacts & Groups', value: 'contacts' },
        ],
        default: 'whatsapp',
      },

      // Operations for WhatsApp
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['whatsapp'] },
        },
        options: [
          { name: 'Send Text Message', value: 'sendText', description: 'Send a single text message' },
          { name: 'Send Media Message', value: 'sendMedia', description: 'Send image, document, video, or audio' },
          { name: 'Get Device Status', value: 'getSenderStatus', description: 'Check WhatsApp sender status' },
        ],
        default: 'sendText',
      },

      // Operations for WABA
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['waba'] },
        },
        options: [
          { name: 'Send Template Message', value: 'sendTemplate', description: 'Send Meta-approved WABA template' },
        ],
        default: 'sendTemplate',
      },

      // Operations for Contacts
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: { resource: ['contacts'] },
        },
        options: [
          { name: 'Create Contact', value: 'createContact', description: 'Create a new contact' },
          { name: 'List Contacts', value: 'listContacts', description: 'Get list of contacts' },
          { name: 'Create Contact Group', value: 'createGroup', description: 'Create a new contact group' },
        ],
        default: 'createContact',
      },

      // Fields for sendText
      {
        displayName: 'To (Recipient Phone)',
        name: 'to',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['whatsapp'],
            operation: ['sendText', 'sendMedia'],
          },
        },
        default: '',
        placeholder: '6281234567890',
        description: 'Destination phone number in international format without + (e.g. 6281234567890)',
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        typeOptions: { rows: 4 },
        required: true,
        displayOptions: {
          show: {
            resource: ['whatsapp'],
            operation: ['sendText'],
          },
        },
        default: '',
        description: 'Text message body to send',
      },
      {
        displayName: 'Sender ID / Phone',
        name: 'senderId',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['whatsapp'],
            operation: ['sendText', 'sendMedia', 'getSenderStatus'],
          },
        },
        default: '',
        description: 'Optional sender device ID or phone number. If omitted, default sender is used.',
      },

      // Fields for sendMedia
      {
        displayName: 'Media URL',
        name: 'mediaUrl',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['whatsapp'],
            operation: ['sendMedia'],
          },
        },
        default: '',
        placeholder: 'https://example.com/image.png',
        description: 'Public URL of the media file to send',
      },
      {
        displayName: 'Caption',
        name: 'caption',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['whatsapp'],
            operation: ['sendMedia'],
          },
        },
        default: '',
        description: 'Optional caption for the media message',
      },
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['whatsapp'],
            operation: ['sendMedia'],
          },
        },
        default: '',
        description: 'Optional filename override for documents or media',
      },

      // Fields for WABA sendTemplate
      {
        displayName: 'To (Recipient Phone)',
        name: 'to',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['waba'],
            operation: ['sendTemplate'],
          },
        },
        default: '',
        placeholder: '6281234567890',
      },
      {
        displayName: 'Template Name',
        name: 'templateName',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['waba'],
            operation: ['sendTemplate'],
          },
        },
        default: '',
        placeholder: 'promo_august',
        description: 'Name of the Meta-approved WABA template',
      },
      {
        displayName: 'Language Code',
        name: 'language',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['waba'],
            operation: ['sendTemplate'],
          },
        },
        default: 'id',
        description: 'Language code of the template (e.g. id, en)',
      },
      {
        displayName: 'Parameters (JSON Array or Comma Separated)',
        name: 'parameters',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['waba'],
            operation: ['sendTemplate'],
          },
        },
        default: '',
        description: 'Template body parameters (e.g. ["Budi", "DISC50"] or Budi, DISC50)',
      },

      // Fields for Contacts
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['contacts'],
            operation: ['createContact', 'createGroup'],
          },
        },
        default: '',
      },
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['contacts'],
            operation: ['createContact'],
          },
        },
        default: '',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['contacts'],
            operation: ['createContact'],
          },
        },
        default: '',
      },
      {
        displayName: 'Group ID',
        name: 'groupId',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['contacts'],
            operation: ['createContact'],
          },
        },
        default: '',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('bablastApi');

    const client = new BablastClient({
      apiKey: credentials.apiKey as string,
      baseUrl: credentials.baseUrl as string,
    });

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: unknown;

        if (resource === 'whatsapp') {
          if (operation === 'sendText') {
            const to = this.getNodeParameter('to', i) as string;
            const message = this.getNodeParameter('message', i) as string;
            const senderId = this.getNodeParameter('senderId', i, '') as string;

            responseData = await client.wa.sendText({
              to,
              message,
              senderId: senderId || undefined,
            });
          } else if (operation === 'sendMedia') {
            const to = this.getNodeParameter('to', i) as string;
            const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
            const caption = this.getNodeParameter('caption', i, '') as string;
            const filename = this.getNodeParameter('filename', i, '') as string;
            const senderId = this.getNodeParameter('senderId', i, '') as string;

            responseData = await client.wa.sendMedia({
              to,
              mediaUrl,
              caption: caption || undefined,
              filename: filename || undefined,
              senderId: senderId || undefined,
            });
          } else if (operation === 'getSenderStatus') {
            const senderId = this.getNodeParameter('senderId', i, '') as string;
            responseData = await client.wa.senders.getStatus(senderId);
          }
        } else if (resource === 'waba') {
          if (operation === 'sendTemplate') {
            const to = this.getNodeParameter('to', i) as string;
            const templateName = this.getNodeParameter('templateName', i) as string;
            const language = this.getNodeParameter('language', i, 'id') as string;
            const rawParams = this.getNodeParameter('parameters', i, '') as string;

            let parameters: string[] | undefined;
            if (rawParams) {
              try {
                parameters = JSON.parse(rawParams);
              } catch {
                parameters = rawParams.split(',').map((s) => s.trim());
              }
            }

            responseData = await client.waba.sendTemplate({
              to,
              templateName,
              language,
              parameters,
            });
          }
        } else if (resource === 'contacts') {
          if (operation === 'createContact') {
            const name = this.getNodeParameter('name', i) as string;
            const phone = this.getNodeParameter('phone', i) as string;
            const email = this.getNodeParameter('email', i, '') as string;
            const groupId = this.getNodeParameter('groupId', i, '') as string;

            responseData = await client.contacts.create({
              name,
              phone,
              email: email || undefined,
              groupId: groupId || undefined,
            });
          } else if (operation === 'listContacts') {
            responseData = await client.contacts.list();
          } else if (operation === 'createGroup') {
            const name = this.getNodeParameter('name', i) as string;
            responseData = await client.contacts.createGroup({ name });
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          const executionData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray({ error: (error as Error).message }),
            { itemData: { item: i } },
          );
          returnData.push(...executionData);
        } else {
          throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
        }
      }
    }

    return [returnData];
  }
}

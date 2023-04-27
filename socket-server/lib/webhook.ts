import Axios from "axios";
import { Game } from "./models";
import { Games } from "./games";

export namespace Webhook {

    const WEBHOOK_URL = "https://discord.com/api/webhooks/1100123414997508136/YD2L1SY8ZpKWGMnNCDmJ85cLmWaVzCmahKHKP4N2zEyJFkIE0WHV5Rg4fmvoBcM4Ph6y";

    export interface Message {
        content?: string | null;
        embeds?: Embed[];
        username: string,
        avatar_url: string;
        attachments?: Attachment[];
    }

    export interface Attachment {}
    
    export interface Embed {
        description?: string;
        url?: string;
        color?: number;
        fields?: Field[];
        author?: Author;
        footer?: Footer;
        timestamp?: string;
    }
    
    export interface Field {
        name: string;
        value: string;
        inline: boolean;
    }

    export interface Author {
        name?: string;
        url?: string;
    }

    export interface Footer {
        text?: string;
    }


    export const sendStatusMessage = async (game: Games, name: string, id: number, fields: Field[]) => {
        let message: Message = {
            content: null,
            embeds: [
              {
                description: `${name} ended. Here is a list of players and their payout:`,
                url: "https://www.gammagambling.com/",
                color: 7021740,
                fields,
                author: {
                  name: "Game Status Notification",
                  url: `https://www.gammagambling.com/games/${id}`
                },
                footer: {
                  text: game
                },
                timestamp: new Date().toISOString()
              }
            ],
            username: "Gamma Gambling",
            avatar_url: "https://media.discordapp.net/attachments/1084882564373815456/1100189975225581619/logo.png",
            attachments: []
        };
        await send(message);
    }

    export const send = async (message: Message) => {
      const res = await Axios.post(WEBHOOK_URL, JSON.stringify(message), { 
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return res.data;
    }

}
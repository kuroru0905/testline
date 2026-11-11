import { Client, FlexMessage } from '@line/bot-sdk';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
};

export const lineClient = new Client(config);

/**
 * Multicast Coupon Flex Message after Event
 */
export async function sendEventCouponsMulticast(lineUserIds: string[], liffUrl: string) {
  if (lineUserIds.length === 0) return;

  const flexMessage: FlexMessage = {
    type: 'flex',
    altText: '【登別下町ナイトクーポン】イベントご参加ありがとうございました！',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '登別下町 ナイトクーポン',
            weight: 'bold',
            size: 'xl',
            color: '#1DB446',
          },
          {
            type: 'text',
            text: '本日の熱狂の余韻そのままに！幌別・登別駅前エリアの居酒屋・バーで使える限定クーポンをお届けします。',
            wrap: true,
            size: 'sm',
            color: '#666666',
            margin: 'md',
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#1DB446',
            action: {
              type: 'uri',
              label: 'クーポン一覧を開く',
              uri: liffUrl,
            },
          },
        ],
      },
    },
  };

  // LINE Multicast allows up to 500 userIds per request
  const chunkSize = 500;
  for (let i = 0; i < lineUserIds.length; i += chunkSize) {
    const chunk = lineUserIds.slice(i, i + chunkSize);
    await lineClient.multicast(chunk, flexMessage);
  }
}

import { NextResponse } from 'next/server';
import OpenAI, { toFile } from 'openai';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function POST(req: Request) {
  try {
    const { message, image, conversationHistory } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Please upload an image first' },
        { status: 400 }
      );
    }

    // Convert base64 to Blob
    const blob = dataURLtoBlob(image);
    
    // Convert Blob to File using toFile
    const file = await toFile(blob, 'input.png', {
      type: 'image/png',
    });

    // Build context from conversation history
    let contextPrompt = '';
    if (conversationHistory && conversationHistory.length > 0) {
      contextPrompt = 'Previous modifications: ' + conversationHistory
        .filter((msg: ConversationMessage) => msg.role === 'user')
        .map((msg: ConversationMessage) => msg.content)
        .join('. ') + '. ';
    }

    // Use the image edit endpoint with the correct model
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: file,
      prompt: `${contextPrompt}Add a detailed tattoo to the image: ${message}. The tattoo should look realistic and blend naturally with the skin. Keep the original image and face of the person(if present) exactly the same, only add the tattoo. Make sure the photo isnt rotated either and stays the same rotation as it was uploaded.`,
      n: 1,
      size: '1024x1024'
    });

    if (!response.data || !response.data[0]?.b64_json) {
      throw new Error('No base64 image data in response');
    }

    // Convert base64 to data URL for frontend display
    const base64Image = response.data[0].b64_json;
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({
      message: 'Here is your image with the requested tattoo!',
      image: dataUrl,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process the request' },
      { status: 500 }
    );
  }
}

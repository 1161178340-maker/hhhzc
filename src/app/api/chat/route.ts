import { NextRequest, NextResponse } from 'next/server';

const { chatWithBot, resetConversation, loadKnowledgeBase } = require('../../../utils/bot');

let isLoaded = false;

function ensureLoaded() {
  if (!isLoaded) {
    loadKnowledgeBase();
    isLoaded = true;
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureLoaded();

    const body = await request.json().catch(() => {
      throw new Error('Invalid JSON format');
    });

    const { message, action } = body;

    if (action === 'reset') {
      resetConversation();
      return NextResponse.json({ success: true, message: 'Conversation reset successfully' });
    }

    if (!message) {
      return NextResponse.json({ 
        error: 'Message is required',
        details: 'Please provide a message in the request body'
      }, { status: 400 });
    }

    if (typeof message !== 'string') {
      return NextResponse.json({ 
        error: 'Invalid message type',
        details: 'Message must be a string'
      }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json({ 
        error: 'Empty message',
        details: 'Message cannot be empty or only whitespace'
      }, { status: 400 });
    }

    if (trimmedMessage.length > 1000) {
      return NextResponse.json({ 
        error: 'Message too long',
        details: 'Message must be less than 1000 characters'
      }, { status: 400 });
    }

    const result = await chatWithBot(trimmedMessage).catch((error: unknown) => {
      console.error('Bot logic error:', error);
      throw new Error('Failed to generate response from bot');
    });

    if (!result || !result.reply) {
      return NextResponse.json({ 
        error: 'Invalid bot response',
        details: 'Bot returned an invalid response'
      }, { status: 500 });
    }

    return NextResponse.json({
      reply: result.reply,
      technique: result.technique || 'Unknown',
      reason: result.reason || 'No reason provided'
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Chat API error:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });

    if (errorMessage === 'Invalid JSON format') {
      return NextResponse.json({ 
        error: 'Invalid request format',
        details: 'Request body must be valid JSON'
      }, { status: 400 });
    }

    if (errorMessage === 'Failed to generate response from bot') {
      return NextResponse.json({ 
        error: 'Bot processing failed',
        details: 'Unable to generate a response. Please try again.'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: 'Internal server error',
      details: 'An unexpected error occurred. Please try again later.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    error: 'Method not allowed',
    details: 'Only POST method is supported for this endpoint'
  }, { status: 405 });
}

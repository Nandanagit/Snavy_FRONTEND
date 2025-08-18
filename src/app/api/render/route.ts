// app/api/render/route.ts
import { renderMedia } from '@remotion/renderer';
import { NextResponse } from 'next/server';
import path from 'path';

// POST /api/render
export async function POST(req: Request) {
  try {
    // Parse request body for composition ID and props
    const { compositionId, inputProps } = await req.json();

    // Output path on the server (for demo purposes only)
    const outPath = path.join(process.cwd(), `out-${Date.now()}.mp4`);

    // Render the video
    await renderMedia({
      composition: compositionId,
      serveUrl: path.join(process.cwd(), 'remotion'),
      codec: 'h264',
      outputLocation: outPath,
      inputProps, // optional props you pass into your video
    });

    return NextResponse.json({
      success: true,
      file: outPath,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

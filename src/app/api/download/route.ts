import { NextRequest, NextResponse } from "next/server";

/**
 * Download Proxy Route
 * 
 * This API route acts as a bridge for file downloads.
 * It fetches files from internal storage or external URLs and 
 * serves them with the correct headers to trigger a browser download.
 */
export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    const filename = req.nextUrl.searchParams.get("filename") ?? "download";

    if (!url) {
        return NextResponse.json({ error: "Missing url param" }, { status: 400 });
    }

    // Resolve relative URLs to absolute
    const absoluteUrl = url.startsWith("/")
        ? `${req.nextUrl.origin}${url}`
        : url;

    try {
        const upstream = await fetch(absoluteUrl);
        if (!upstream.ok) {
            return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
        }

        const buffer = await upstream.arrayBuffer();
        const contentType =
            upstream.headers.get("content-type") ?? "application/octet-stream";

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": buffer.byteLength.toString(),
                "Cache-Control": "no-store",
            },
        });
    } catch {
        return NextResponse.json({ error: "Download failed" }, { status: 500 });
    }
}

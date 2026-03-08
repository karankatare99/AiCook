import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";

const Schema = z.object({ prompt: z.string() })

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = Schema.safeParse(body);

    if (!parsed.success) return NextResponse.json({ message: "Wrong prompt format" }, { status: 405 })
    const { prompt } = parsed.data;

    const res = await axios.get(`https://devilsapi.classy0.workers.dev/?prompt=${prompt}`)
    const { Response } = res.data;

    return NextResponse.json({ response: Response });
}
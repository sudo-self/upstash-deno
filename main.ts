import { serve } from "https://deno.land/std@0.142.0/http/server.ts";
import { Redis } from "https://deno.land/x/upstash_redis@v1.14.0/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

config({ export: true });


function generateRandomHexColor() {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
}

serve(async (req: Request) => {
    if (!req.url.endsWith("favicon.ico")) {
        const token = Deno.env.get("UPSTASH_REDIS_TOKEN");
        const redisUrl = Deno.env.get("UPSTASH_REDIS_URL");

        if (!token || !redisUrl) {
            throw new Error("UPSTASH_REDIS_TOKEN or UPSTASH_REDIS_URL environment variables are not set.");
        }

        const redis = new Redis({
            url: redisUrl,
            token: token,
        });

        const counter = await redis.incr("deno-counter");
        const randomColor = generateRandomHexColor();
        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Upstash-Deno</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-gray-100 flex flex-col items-center justify-center h-screen">
                <div class="max-w-md w-full mx-auto rounded-lg p-6 mb-4" style="background-color: ${randomColor};">
                    <div class="bg-white shadow-md rounded-lg p-6">
                        <h1 class="text-3xl font-semibold text-center mb-4 cursor-pointer text-green-500 hover:text-green-600" onclick="location.reload()">Refresh</h1>
                        <div class="text-center">
                            <p class="text-5xl font-bold mb-4">${counter}</p>
                            <p class="text-lg text-gray-500 mb-4">@Upstash</p>
                        </div>
                    </div>
                </div>
                <script async defer src="https://buttons.github.io/buttons.js"></script>  
                </body>
            </html>
        `;

        return new Response(htmlResponse, { status: 200, headers: { "Content-Type": "text/html" } });
    }
});




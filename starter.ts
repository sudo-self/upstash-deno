import { serve } from "https://deno.land/std@0.142.0/http/server.ts";
import { Redis } from "https://deno.land/x/upstash_redis@v1.14.0/mod.ts";

serve(async (_req: Request) => {

    if( ! _req.url.endsWith("favicon.ico") ) {
        const redis = new Redis({
            url: 'https://amused-walleye-31373.upstash.io',
            token: 
'AXqNASQgMWZmMTdjYTEtNTJjYi00MDczLWJmZDctNjFjZGUyOTA0ZjEyNjcyMTI0NDM2MDBjNDVmZmE5NjJlMTllYTkyMDI2MDU=',
        })

        const counter = await redis.incr("deno-counter");
        return new Response(JSON.stringify({ counter }), { status: 200 });
    }


});

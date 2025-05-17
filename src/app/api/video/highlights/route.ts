import { sieveAxios } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
    const { file } = await req.json();

    const sieveData = await sieveAxios.post("/push", {
        function: "sieve/highlights",
        inputs: {
            file: { "url": file },
            render_clips: true,
            highlight_search_phrases: "most viral clips"
        }
    });

    const promise = new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            const response = await sieveAxios.get(`/jobs/${sieveData.data.id}`);

            if (response.data.status === 'finished') {
                clearInterval(interval);
                resolve(response.data);
            } else if (response.data.status === 'error') {
                clearInterval(interval);
                reject(new Error('Job failed'));
            }
        }, 5000);
    });

    return NextResponse.json(await promise);
};

export { handler as POST };


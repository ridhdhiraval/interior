const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');

/**
 * @route   POST /api/ai/generate-design
 * @desc    Generate room design using Mistral AI (Vision) and Pollinations (Image Gen)
 * @access  Private
 */
router.post('/generate-design', auth, async (req, res) => {
    const { roomType, style, colors, description, roomImage } = req.body;
    
    // Prioritize API key from .env, fallback to the one provided earlier
    const apiKey = (process.env.MISTRAL_API_KEY || "ANEg145zYTOLEUf65r2tVQhSQRemifNk").trim();

    console.log(`--- AI Generation Start ---`);
    console.log(`Room: ${roomType}, Style: ${style}, Colors: ${colors}`);

    try {
        const messages = [
            {
                role: "system",
                content: "You are a specialized AI for interior design modifications. Your task is to analyze the provided image and the user's request, then generate a highly detailed, single-paragraph prompt for an image generator (like Flux). " +
                         "RULES:\n" +
                         "1. Focus ONLY on the requested changes.\n" +
                         "2. Maintain the original room's architectural layout (walls, floor, ceiling) unless asked to change them.\n" +
                         "3. Output ONLY the descriptive prompt. No introductory text."
            }
        ];

        if (roomImage) {
            // Clean base64 data
            const base64Data = roomImage.includes('base64,') ? roomImage.split('base64,')[1] : roomImage;
            const mimeType = roomImage.includes('image/png') ? 'image/png' : 'image/jpeg';

            messages.push({
                role: "user",
                content: [
                    { 
                        type: "image_url", 
                        image_url: { url: `data:${mimeType};base64,${base64Data}` } 
                    },
                    { 
                        type: "text", 
                        text: `STRICT MODIFICATION: Perform these changes to this ${style} ${roomType} with ${colors} colors: ${description}. Keep EVERYTHING ELSE exactly as it is in the photo.` 
                    }
                ]
            });
        } else {
            messages.push({ 
                role: "user", 
                content: `Design a ${style} ${roomType} from scratch based on these requirements: ${description} with ${colors} color scheme.` 
            });
        }

        // 1. Get detailed prompt from Mistral
        console.log('Fetching prompt from Mistral...');
        const mistralRes = await axios.post("https://api.mistral.ai/v1/chat/completions", {
            model: "pixtral-12b-2409",
            messages: messages,
            max_tokens: 500,
            temperature: 0.1
        }, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            timeout: 60000 // Increased to 60 seconds
        });

        let detailedPrompt = mistralRes.data.choices[0].message.content;
        
        // Cleanup
        detailedPrompt = detailedPrompt
            .replace(/^(Here is|The following|Prompt:|Result:).*?:/si, '')
            .replace(/```[a-z]*|```/gi, '')
            .replace(/\n/g, ' ')
            .trim();

        if (detailedPrompt.length > 600) {
            detailedPrompt = detailedPrompt.substring(0, 600);
        }

        console.log('Generated Prompt:', detailedPrompt);

        // 2. Generate final image using Pollinations (Flux)
        const seed = Math.floor(Math.random() * 1000000);
        const finalImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(detailedPrompt)}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}`;

        console.log('Downloading image from Pollinations (with retry logic)...');
        
        // SERVER-SIDE DOWNLOAD with Retry Logic
        let imageRes;
        let retries = 3;
        while (retries > 0) {
            try {
                imageRes = await axios.get(finalImageUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 60000 // Increased to 60 seconds
                });
                break; // Success
            } catch (downloadErr) {
                retries--;
                console.log(`Download failed, retries left: ${retries}. Error: ${downloadErr.message}`);
                if (retries === 0) throw downloadErr;
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
            }
        }
        
        const base64Image = Buffer.from(imageRes.data, 'binary').toString('base64');
        const dataUrl = `data:image/png;base64,${base64Image}`;

        console.log('--- AI Generation Success ---');
        
        res.json({
            success: true,
            imageUrl: dataUrl,
            prompt: detailedPrompt
        });

    } catch (err) {
        console.error('AI Route Error:', err.message);
        
        let errorDetail = err.message;
        if (err.code === 'ENOTFOUND') {
            errorDetail = "DNS Error: Backend could not reach api.mistral.ai. Check internet connection.";
        } else if (err.response) {
            errorDetail = `API Error (${err.response.status}): ${JSON.stringify(err.response.data)}`;
        }

        res.status(500).json({ 
            success: false, 
            message: 'Generation failed',
            detail: errorDetail
        });
    }
});

module.exports = router;
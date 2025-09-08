import { GoogleGenAI, Modality } from "@google/genai";
import type { FormData, GeneratedMarketingKit } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getApiKey = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    return process.env.API_KEY;
}

const processImageParts = (response: any, defaultTitle = '') => {
    const images: {image: string, title?: string}[] = [];
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      let currentTitle: string | undefined = undefined;
      for (const part of response.candidates[0].content.parts) {
          if (part.text) {
              currentTitle = part.text.replace(/\*+/g, '').replace('Title:', '').trim();
          } else if (part.inlineData) {
              const base64ImageBytes = part.inlineData.data;
              const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
              images.push({ image: imageUrl, title: currentTitle || defaultTitle });
              currentTitle = undefined; 
          }
      }
    }
    return images;
}

export const generateSourceImage = async (formData: FormData): Promise<string> => {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        A professional, high-resolution photograph for a "${formData.businessType}" business.
        The user wants an image described as follows: "${formData.imageDescription}".
        The scene should incorporate brand colors like "${formData.colors || 'vibrant and appealing colors'}".
        The image must be clean, eye-catching, high-quality, and suitable as a primary asset for a marketing poster.
        Avoid any text or logos on the image. Focus on a compelling visual based on the user's description.
    `;

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("AI image generation failed to return an image.");
    }
};

const formatMap: Record<string, string> = {
  instagramPost: 'Instagram Post (1080x1080px)',
  instagramStory: 'Instagram Story (1080x1920px)',
  facebookAd: 'Facebook Ad Banner (1200x628px)',
  linkedInBanner: 'LinkedIn Banner (1584x396px)',
  twitterHeader: 'Twitter/X Post Header (1600x900px)',
  youtubeThumbnail: 'YouTube Thumbnail (1280x720px)',
  websiteHero: 'Website Hero Banner (1920x1080px)',
  flyerA5: 'Printed Flyer A5 (148x210mm)',
  posterA3: 'Printed Poster A3 (297x420mm)',
  postcard: 'Postcard (4x6 inches)',
  businessCard: 'Business Card (3.5x2 inches)',
  whatsappShare: 'WhatsApp/Telegram Share Image (800x800px)',
};


export const generateMarketingKit = async (formData: FormData, imageFile: File, customerSelfieFile: File | null): Promise<GeneratedMarketingKit> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const kit: GeneratedMarketingKit = {
      posters: [],
      socialMedia: [],
      mockups: [],
      customerAds: [],
      multilingualVersions: [],
      renders: [],
      qrCode: null,
  };

  const seasonalTheme = !formData.seasonalAdaptation || formData.seasonalAdaptation.toLowerCase() === 'none' 
    ? 'None' 
    : formData.seasonalAdaptation;

  const neonEffectInstruction = formData.neonGlowMode 
    ? "Apply a special effect: dramatic neon lighting, glowing text, and a high-contrast, vibrant style suitable for a nightlife promotion (e.g., bar, club, lounge)." 
    : "";

  const customSizeInstruction = (formData.width && formData.height && !isNaN(Number(formData.width)) && !isNaN(Number(formData.height)))
    ? `The output resolution for these posters must be exactly ${formData.width}px by ${formData.height}px.`
    : "";

  // 1. Generate Poster Variations
  const posterPrompt = `
    You are a professional marketing designer creating a full campaign kit.
    Your goal is to generate **3 distinct, high-quality poster variations** by adding text and enhancements directly onto the provided image.

    **Instructions:**
    1.  **Core Task:** Overlay text onto the image to create a seamless, single-image advertisement. Return 3 separate, complete image variations in the response.
    2.  **Image Enhancement:** Subtly enhance the lighting, colors, and sharpness of the original photo to make it stand out.
    3.  **Branding:** Create and subtly place a minimal, elegant logo-style watermark for "${formData.businessName}".
    4.  **Content to Add:**
        *   Business Name: "${formData.businessName}"
        *   Offer: "${formData.offer}" (This should be the most prominent text).
        *   Call to Action: "${formData.callToAction}"
    5.  **Styling:**
        *   Business Type Context: ${formData.businessType}
        *   Color Palette: Inspired by ${formData.colors}
        *   Seasonal Theme: ${seasonalTheme}
    6.  **Special Instructions:**
        *   ${neonEffectInstruction}
        *   ${customSizeInstruction}
    7.  **Output:** Provide exactly 3 final, edited images as separate parts in your response. Do not add descriptive text.
  `;

  const imagePart = await fileToGenerativePart(imageFile);
  const posterResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: { parts: [imagePart, { text: posterPrompt }] },
    config: { responseModalities: [Modality.IMAGE] },
  });

  kit.posters = processImageParts(posterResponse);

  if (kit.posters.length === 0) {
      throw new Error("The AI did not return any poster images. It may have refused the request.");
  }
  
  // 2. Generate Digital & Print Assets if requested
  const requestedFormats = Object.entries(formData.formatSelections)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => formatMap[key]);

  if (requestedFormats.length > 0) {
      const firstPosterBlob = await (await fetch(kit.posters[0].image)).blob();
      const firstPosterPart = await fileToGenerativePart(new File([firstPosterBlob], 'poster.png', {type: 'image/png'}));
      
      const digitalAndPrintPrompt = `
        You are a professional graphic designer. Your task is to reformat the provided poster design for various digital and print channels.
        Ensure that the layouts adapt naturally to each size while keeping the business name, offer, and call-to-action clearly visible. Maintain consistency in style, branding, and readability across all formats.

        Generate a separate, complete image for each of the following ${requestedFormats.length} formats. For each image, provide its corresponding title as a text part immediately before the image part.

        ${requestedFormats.map((format, index) => `${index + 1}. Title: ${format}`).join('\n')}
      `;

      const socialResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image-preview',
          contents: { parts: [firstPosterPart, { text: digitalAndPrintPrompt }] },
          config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
      });
      const socialImages = processImageParts(socialResponse);
      kit.socialMedia = socialImages.map(img => ({
          format: img.title || 'Untitled Format',
          image: img.image
      }));
  }
  
  // 3. Generate 3D Mockups
  if (formData.mockupRequests) {
    const requestedMockups = formData.mockupRequests.split(',').map(s => s.trim()).filter(s => s);
    if (requestedMockups.length > 0) {
      const firstPosterBlob = await (await fetch(kit.posters[0].image)).blob();
      const firstPosterPart = await fileToGenerativePart(new File([firstPosterBlob], 'poster.png', {type: 'image/png'}));
      const mockupPrompt = `
        You are a mockup specialist. Take the provided poster image and place it onto a variety of realistic mockups.
        
        Generate a separate, final image for each of the following ${requestedMockups.length} scenarios:
        ${requestedMockups.map((mockup, index) => `${index + 1}. ${mockup}`).join('\n')}

        For each image, provide a short, descriptive title as a text part immediately before the image part (e.g., "Poster mockup on a city billboard.").
      `;
      const mockupResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [firstPosterPart, { text: mockupPrompt }] },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
      });
      kit.mockups = processImageParts(mockupResponse);
    }
  }

  // 4. Generate Customer-Generated Ads
  if (formData.generateCustomerAd && customerSelfieFile) {
    const mainPosterBlob = await (await fetch(kit.posters[0].image)).blob();
    const mainPosterPart = await fileToGenerativePart(new File([mainPosterBlob], 'poster.png', {type: 'image/png'}));
    const selfiePart = await fileToGenerativePart(customerSelfieFile);

    const customerAdPrompt = `
      You are a creative ad designer. A customer has uploaded their selfie to be part of a promotion for "${formData.businessName}".
      Your task is to creatively and tastefully blend the customer's selfie (second image) with the main promotional image (first image).
      
      **Instructions:**
      1.  **Combine Images:** The customer should look happy and engaged with the product/service. The ad should feel authentic, fun, and community-focused. Do not just place the selfie in a box; integrate it naturally.
      2.  **Maintain Branding:** Keep the main promotional text from the first image clear and readable. The offer is "${formData.offer}" and the call to action is "${formData.callToAction}".
      3.  **Generate Variations:** Create 2 fun, distinct variations of this customer-generated ad.
      4.  **Output:** Return exactly 2 final, edited images as separate parts in your response. Do not add descriptive text.
    `;
    
    const customerAdResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [mainPosterPart, selfiePart, { text: customerAdPrompt }] },
      config: { responseModalities: [Modality.IMAGE] },
    });
    kit.customerAds = processImageParts(customerAdResponse);
  }

  // 5. Generate Multilingual Versions
  const targetLanguages = formData.targetLanguages.split(',').map(s => s.trim()).filter(s => s);
  if (targetLanguages.length > 0) {
      const firstPosterBlob = await (await fetch(kit.posters[0].image)).blob();
      const firstPosterPart = await fileToGenerativePart(new File([firstPosterBlob], 'poster.png', {type: 'image/png'}));
      
      const multilingualPrompt = `
        You are a localization expert and graphic designer. The provided poster is in English.
        Your task is to translate and adapt the text on this poster for the following languages: ${targetLanguages.join(', ')}.

        **Instructions:**
        1.  **Translate Accurately:** Translate the text content (Business Name, Offer, Call to Action) into each specified language.
        2.  **Maintain Design:** Preserve the original design's style, fonts, colors, and layout as closely as possible.
        3.  **Cultural Adaptation:** Ensure translations are culturally appropriate for local markets.
        4.  **Output Format:** For each language, provide a title with the language name (e.g., "Title: Spanish Version") as a text part immediately before its corresponding translated image part.
      `;
      
      const multilingualResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [firstPosterPart, { text: multilingualPrompt }] },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
      });
      kit.multilingualVersions = processImageParts(multilingualResponse);
  }

  // 6. Generate 3D Renders
  if (formData.generate3dRender) {
    const renderPrompt = `
      You are a 3D rendering artist. Transform the provided 2D product photo into a realistic, high-fidelity 3D-like render. 
      The product should look hyper-realistic with dynamic lighting, dramatic shadows, and intricate textures. 
      Place it against a clean, modern studio background that complements the product.
      
      Generate 2 different, visually stunning renders from different angles or with different lighting setups.
      For each image, provide a short, descriptive title as a text part immediately before the image part (e.g., "3D Render - Front View").
    `;
    
    const renderResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, { text: renderPrompt }] },
      config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });
    kit.renders = processImageParts(renderResponse);
  }

  // 7. Generate QR Code
  if (formData.generateQrCode && formData.qrCodeUrl) {
    const qrCodePrompt = `
      You are a utility that generates QR codes.
      Create a standard, scannable QR code image that encodes this exact URL: ${formData.qrCodeUrl}
      
      **Requirements:**
      1.  The QR code must be black on a solid white background.
      2.  Include a standard quiet zone (a blank margin) around the code.
      3.  Do not add any logos, text, or other design elements to the QR code image itself.
      4.  Output a single, high-contrast, clear image that can be reliably scanned by a mobile device.
    `;
    
    const qrCodeResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [{ text: qrCodePrompt }] },
      config: { responseModalities: [Modality.IMAGE] },
    });

    const qrImages = processImageParts(qrCodeResponse, 'QR Code');
    if (qrImages.length > 0) {
        kit.qrCode = qrImages[0];
    }
  }


  return kit;
};
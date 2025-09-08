import React, { useState, useCallback, useEffect } from 'react';
import { PosterForm } from './components/PosterForm';
import { PosterPreview } from './components/PosterPreview';
import { Header } from './components/Header';
import { generateMarketingKit, generateSourceImage } from './services/geminiService';
import type { FormData, GeneratedPoster, GeneratedSocial, GeneratedMockup, GeneratedCustomerAd, GeneratedMultilingual, Generated3dRender, GeneratedQrCode } from './types';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    businessType: 'restaurant',
    imageDescription: '',
    businessName: '',
    offer: '',
    colors: '',
    callToAction: '',
    width: '',
    height: '',
    seasonalAdaptation: '',
    mockupRequests: '',
    formatSelections: {
      instagramPost: false,
      instagramStory: false,
      facebookAd: false,
      linkedInBanner: false,
      twitterHeader: false,
      youtubeThumbnail: false,
      websiteHero: false,
      flyerA5: false,
      posterA3: false,
      postcard: false,
      businessCard: false,
      whatsappShare: false,
    },
    generateCustomerAd: false,
    generate3dRender: false,
    neonGlowMode: false,
    targetLanguages: '',
    generateQrCode: false,
    qrCodeUrl: '',
  });
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceCustomerSelfie, setSourceCustomerSelfie] = useState<string | null>(null);
  const [sourceCustomerSelfieFile, setSourceCustomerSelfieFile] = useState<File | null>(null);
  
  const [generatedPosters, setGeneratedPosters] = useState<GeneratedPoster[]>([]);
  const [generatedSocials, setGeneratedSocials] = useState<GeneratedSocial[]>([]);
  const [generatedMockups, setGeneratedMockups] = useState<GeneratedMockup[]>([]);
  const [generatedCustomerAds, setGeneratedCustomerAds] = useState<GeneratedCustomerAd[]>([]);
  const [generatedMultilingual, setGeneratedMultilingual] = useState<GeneratedMultilingual[]>([]);
  const [generated3dRenders, setGenerated3dRenders] = useState<Generated3dRender[]>([]);
  const [generatedQrCode, setGeneratedQrCode] = useState<GeneratedQrCode | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSourceImage, setIsGeneratingSourceImage] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetGeneratedAssets = () => {
    setGeneratedPosters([]);
    setGeneratedSocials([]);
    setGeneratedMockups([]);
    setGeneratedCustomerAds([]);
    setGeneratedMultilingual([]);
    setGenerated3dRenders([]);
    setGeneratedQrCode(null);
    setError(null);
  };

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => {
        const nextState = { ...prev, [name]: checked };
        if (name === 'generateCustomerAd' && !checked) {
            setSourceCustomerSelfie(null);
            setSourceCustomerSelfieFile(null);
        }
        if (name === 'generateQrCode' && !checked) {
            nextState.qrCodeUrl = '';
        }
        return nextState;
    });
  }, []);

  const handleFormatSelectionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      formatSelections: {
        ...prev.formatSelections,
        [name]: checked,
      },
    }));
  }, []);


  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSourceImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        resetGeneratedAssets();
      };
      reader.readAsDataURL(file);
    }
  }, []);
  
  const handleCustomerSelfieChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSourceCustomerSelfieFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceCustomerSelfie(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleGenerateSourceImage = async () => {
    setIsGeneratingSourceImage(true);
    setError(null);
    resetGeneratedAssets();
    try {
        const base64Image = await generateSourceImage(formData);
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;
        setSourceImage(dataUrl);

        // Convert base64 to File object to be used by the marketing kit generator
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "generated-image.jpg", { type: "image/jpeg" });
        setSourceImageFile(file);

    } catch (err) {
        setError(err instanceof Error ? `Image generation failed: ${err.message}` : 'An unknown error occurred during image generation.');
    } finally {
        setIsGeneratingSourceImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!sourceImageFile) {
      setError('Please upload or generate an image first.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Generating campaign assets...');
    resetGeneratedAssets();

    try {
      const result = await generateMarketingKit(formData, sourceImageFile, sourceCustomerSelfieFile);
      setGeneratedPosters(result.posters);
      setGeneratedSocials(result.socialMedia);
      setGeneratedMockups(result.mockups);
      setGeneratedCustomerAds(result.customerAds);
      setGeneratedMultilingual(result.multilingualVersions);
      setGenerated3dRenders(result.renders);
      setGeneratedQrCode(result.qrCode);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? `Generation failed: ${err.message}` : 'An unknown error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <PosterForm
            formData={formData}
            sourceImage={sourceImage}
            sourceCustomerSelfie={sourceCustomerSelfie}
            onFormChange={handleFormChange}
            onCheckboxChange={handleCheckboxChange}
            onFormatSelectionChange={handleFormatSelectionChange}
            onFileChange={handleFileChange}
            onCustomerSelfieChange={handleCustomerSelfieChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onGenerateSourceImage={handleGenerateSourceImage}
            isGeneratingSourceImage={isGeneratingSourceImage}
          />
          <PosterPreview
            posters={generatedPosters}
            socials={generatedSocials}
            mockups={generatedMockups}
            customerAds={generatedCustomerAds}
            multilingualVersions={generatedMultilingual}
            renders={generated3dRenders}
            qrCode={generatedQrCode}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            error={error}
          />
        </div>
      </main>
      <footer className="text-center p-6 text-slate-400 text-sm">
        <p>&copy; 2024 Momentum AI. The All-in-One Marketing Automation Platform.</p>
      </footer>
    </div>
  );
};

export default App;
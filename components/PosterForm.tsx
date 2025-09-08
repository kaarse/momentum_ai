import React from 'react';
import type { FormData } from '../types';

interface PosterFormProps {
  formData: FormData;
  sourceImage: string | null;
  sourceCustomerSelfie: string | null;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormatSelectionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomerSelfieChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onGenerateSourceImage: () => void;
  isGeneratingSourceImage: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-slate-500 mb-2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const FormInput: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; list?: string; type?: string }> = ({ label, name, value, onChange, placeholder, list, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            list={list}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-slate-100 placeholder:text-slate-500"
        />
    </div>
);

const FormTextArea: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }> = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-slate-100 placeholder:text-slate-500"
        />
    </div>
);


const Checkbox: React.FC<{ label: string; description?: string; name: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, description, name, checked, onChange }) => (
    <div className="relative flex items-start">
        <div className="flex h-6 items-center">
            <input
                id={name}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-600"
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={name} className="font-medium text-slate-200">{label}</label>
            {description && <p className="text-slate-400">{description}</p>}
        </div>
    </div>
);

const formatOptions = [
    { name: 'instagramPost', label: 'Instagram Post', description: '1080x1080px' },
    { name: 'instagramStory', label: 'Instagram Story', description: '1080x1920px' },
    { name: 'facebookAd', label: 'Facebook Ad', description: '1200x628px' },
    { name: 'linkedInBanner', label: 'LinkedIn Banner', description: '1584x396px' },
    { name: 'twitterHeader', label: 'Twitter/X Header', description: '1600x900px' },
    { name: 'youtubeThumbnail', label: 'YouTube Thumbnail', description: '1280x720px' },
    { name: 'websiteHero', label: 'Website Hero', description: '1920x1080px' },
    { name: 'flyerA5', label: 'Flyer A5', description: 'Print Ready' },
    { name: 'posterA3', label: 'Poster A3', description: 'Print Ready' },
    { name: 'postcard', label: 'Postcard', description: '4x6 inches' },
    { name: 'businessCard', label: 'Business Card', description: '3.5x2 inches' },
    { name: 'whatsappShare', label: 'WhatsApp Image', description: '800x800px' },
];

export const PosterForm: React.FC<PosterFormProps> = ({ formData, sourceImage, sourceCustomerSelfie, onFormChange, onCheckboxChange, onFormatSelectionChange, onFileChange, onCustomerSelfieChange, onSubmit, isLoading, onGenerateSourceImage, isGeneratingSourceImage }) => {
  return (
    <div className="bg-slate-800/50 ring-1 ring-white/10 p-6 md:p-8 rounded-2xl shadow-2xl shadow-slate-950/50">
      <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6 pb-4 border-b border-slate-700">1. Define Your Primary Asset</h2>
             <p className="text-sm text-slate-400 mb-4 -mt-4">Upload your main image, or generate one with AI using a detailed description.</p>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl bg-slate-800/30">
                <div className="space-y-1 text-center">
                    {sourceImage ? (
                        <img src={sourceImage} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
                    ) : (
                       <UploadIcon />
                    )}
                    <div className="flex text-sm text-slate-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/png, image/jpeg, image/webp" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>
                </div>
            </div>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-slate-800/50 px-3 text-sm font-medium text-slate-400">OR</span>
                </div>
            </div>
             <div className="space-y-4">
                 <FormTextArea
                    label="Describe the Image to Generate with AI"
                    name="imageDescription"
                    value={formData.imageDescription}
                    onChange={onFormChange}
                    placeholder="e.g., A vibrant flat-lay of a gourmet burger and fries on a rustic wooden table, with dramatic lighting."
                    rows={4}
                />
                <button
                    onClick={onGenerateSourceImage}
                    disabled={isGeneratingSourceImage || isLoading || !formData.imageDescription}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-indigo-500 rounded-lg shadow-sm text-md font-medium text-indigo-400 bg-transparent hover:bg-indigo-500/10 disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-150 ease-in-out"
                >
                    {isGeneratingSourceImage ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Image...
                        </>
                    ) : '✨ Generate Image with AI'}
                </button>
            </div>
        </div>
        
        <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6 pb-4 border-b border-slate-700">2. Define Your Campaign</h2>
            <div className="space-y-4">
                <FormInput
                    label="Business Type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={onFormChange}
                    placeholder="e.g., Modern Cafe / Coffee Shop"
                    list="business-type-options"
                />
                <datalist id="business-type-options">
                    <option value="Restaurant / Fine Dining" />
                    <option value="Cafe / Modern Coffee Shop" />
                    <option value="Bar / Urban Nightclub" />
                    <option value="Bakery / Artisan Patisserie" />
                    <option value="Retail Store / Fashion Boutique" />
                    <option value="Beauty Salon / Luxury Spa" />
                    <option value="Gym / High-Intensity Fitness Studio" />
                    <option value="Real Estate / Urban Properties" />
                    <option value="Tech Startup / SaaS Company" />
                    <option value="Healthcare / Medical Clinic" />
                    <option value="Pet Services / Dog Grooming" />
                    <option value="Event Planner / Wedding Coordinator" />
                    <option value="Photography / Portrait Studio" />
                    <option value="Financial Services / Investment Firm" />
                    <option value="Automotive / Car Detailing Service" />
                    <option value="Landscaping / Garden Design" />
                    <option value="Education / Online Learning Platform" />
                    <option value="Non-Profit / Charitable Organization" />
                    <option value="Travel Agency / Adventure Tours" />
                    <option value="Music Venue / Live Concerts" />
                    <option value="Bookstore / Independent Reading Nook" />
                    <option value="Yoga Studio / Wellness Center" />
                </datalist>
                <FormInput label="Business Name" name="businessName" value={formData.businessName} onChange={onFormChange} placeholder="e.g., The Golden Spoon" />
                <FormInput label="Offer / Promotion" name="offer" value={formData.offer} onChange={onFormChange} placeholder="e.g., 50% Off All Appetizers" />
                <FormInput label="Brand Colors" name="colors" value={formData.colors} onChange={onFormChange} placeholder="e.g., Gold, Black, White" />
                <FormInput label="Call to Action" name="callToAction" value={formData.callToAction} onChange={onFormChange} placeholder="e.g., Book Now" />
                
                 <FormInput 
                    label="Seasonal Adaptation (Optional)" 
                    name="seasonalAdaptation" 
                    value={formData.seasonalAdaptation} 
                    onChange={onFormChange}
                    placeholder="e.g., Summer Vibes, Diwali Festival"
                    list="seasonal-options"
                />
                <datalist id="seasonal-options">
                    <option value="Summer Vibes" />
                    <option value="Autumn Theme" />
                    <option value="Winter / Holiday" />
                    <option value="Spring Freshness" />
                    <option value="Diwali Festival" />
                    <option value="Christmas" />
                    <option value="New Year's Celebration" />
                </datalist>
                <FormInput 
                    label="Target Languages (Optional)" 
                    name="targetLanguages" 
                    value={formData.targetLanguages} 
                    onChange={onFormChange}
                    placeholder="e.g., Spanish, French, Japanese"
                    list="language-options"
                />
                <datalist id="language-options">
                    <option value="Spanish" />
                    <option value="French" />
                    <option value="German" />
                    <option value="Mandarin Chinese" />
                    <option value="Japanese" />
                    <option value="Korean" />
                    <option value="Italian" />
                    <option value="Portuguese" />
                    <option value="Russian" />
                    <option value="Arabic" />
                    <option value="Hindi" />
                    <option value="Bengali" />
                    <option value="Dutch" />
                    <option value="Swedish" />
                    <option value="Turkish" />
                    <option value="Vietnamese" />
                </datalist>
                 <p className="text-xs text-slate-500 -mt-3">Enter comma-separated languages. Choose from the list or type your own.</p>
            </div>
        </div>

        <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6 pb-4 border-b border-slate-700">3. Add Creative Features</h2>
            <div className="space-y-4">
                 <Checkbox
                    label="3D Product Renders"
                    description="Turn 2D photos into realistic 3D-like visuals."
                    name="generate3dRender"
                    checked={formData.generate3dRender}
                    onChange={onCheckboxChange}
                />
                <Checkbox
                    label="Neon / Glow Mode"
                    description="Special effects for nightlife businesses."
                    name="neonGlowMode"
                    checked={formData.neonGlowMode}
                    onChange={onCheckboxChange}
                />
                <Checkbox
                    label="Generate Customer Ad"
                    description="Blend customer selfies into promo posters."
                    name="generateCustomerAd"
                    checked={formData.generateCustomerAd}
                    onChange={onCheckboxChange}
                />
                {formData.generateCustomerAd && (
                    <div className="mt-2 pl-8">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Upload Customer Selfie</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl">
                            <div className="space-y-1 text-center">
                                {sourceCustomerSelfie ? (
                                    <img src={sourceCustomerSelfie} alt="Selfie Preview" className="mx-auto h-24 w-auto rounded-md" />
                                ) : (
                                   <UploadIcon />
                                )}
                                <div className="flex text-sm text-slate-400">
                                    <label htmlFor="customer-selfie-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-400 hover:text-indigo-300">
                                        <span>Upload a selfie</span>
                                        <input id="customer-selfie-upload" name="customer-selfie-upload" type="file" className="sr-only" onChange={onCustomerSelfieChange} accept="image/png, image/jpeg, image/webp" />
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500">PNG, JPG, WEBP</p>
                            </div>
                        </div>
                    </div>
                )}
                <Checkbox
                    label="Generate QR Code"
                    description="Generate a QR Code for your link."
                    name="generateQrCode"
                    checked={formData.generateQrCode}
                    onChange={onCheckboxChange}
                />
                {formData.generateQrCode && (
                    <div className="mt-2 pl-8">
                        <FormInput
                            label="Destination URL for QR Code"
                            name="qrCodeUrl"
                            value={formData.qrCodeUrl}
                            onChange={onFormChange}
                            placeholder="https://example.com/my-offer"
                        />
                    </div>
                )}
            </div>
        </div>

        <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6 pb-4 border-b border-slate-700">4. Specify 3D Mockups (Optional)</h2>
            <FormInput 
                label="Enter comma-separated mockup ideas"
                name="mockupRequests"
                value={formData.mockupRequests}
                onChange={onFormChange}
                placeholder="e.g., city billboard, t-shirt, coffee mug"
                list="mockup-options"
            />
            <p className="text-xs text-slate-500 mt-1">Places poster on billboards, flyers, etc. Choose from the list or type your own.</p>
            <datalist id="mockup-options">
                <option value="City Billboard" />
                <option value="Bus Stop Ad" />
                <option value="Framed Poster on Wall" />
                <option value="T-Shirt (Front)" />
                <option value="Coffee Mug" />
                <option value="Tote Bag" />
                <option value="Smartphone Screen" />
                <option value="Laptop Screen" />
                <option value="Hardcover Book Cover" />
                <option value="Magazine Ad" />
                <option value="Flyer on a Table" />
                <option value="Storefront Window" />
                <option value="Exhibition Stand" />
                <option value="Subway Ad" />
                <option value="Social Media Post (Instagram)" />
                <option value="Pillow on a Sofa" />
                <option value="Shopping Bag" />
                <option value="Vinyl Record Cover" />
                <option value="Product Packaging Box" />
                <option value="Web Banner Ad" />
                <option value="Canvas Print in Art Gallery" />
                <option value="Cap/Hat" />
                <option value="Skateboard Deck" />
            </datalist>
        </div>

         <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6 pb-4 border-b border-slate-700">5. Select Asset Formats</h2>
            <p className="text-sm text-slate-400 mb-4 -mt-4">Set a custom size for your main poster variations. Other formats will use their standard dimensions.</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <FormInput label="Width (px)" name="width" value={formData.width} onChange={onFormChange} placeholder="e.g., 1080" type="number"/>
                <FormInput label="Height (px)" name="height" value={formData.height} onChange={onFormChange} placeholder="e.g., 1920" type="number"/>
            </div>
             <fieldset className="space-y-4 pt-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                    {formatOptions.map(option => (
                        <Checkbox 
                            key={option.name}
                            label={option.label}
                            description={option.description}
                            name={option.name}
                            checked={formData.formatSelections[option.name as keyof typeof formData.formatSelections]}
                            onChange={onFormatSelectionChange}
                        />
                    ))}
                </div>
            </fieldset>
        </div>


        <button
          onClick={onSubmit}
          disabled={isLoading || isGeneratingSourceImage || !sourceImage}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-500 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transform hover:-translate-y-0.5 transition-all duration-150 ease-in-out"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : '🚀 Generate Campaign Assets'}
        </button>
      </div>
    </div>
  );
};
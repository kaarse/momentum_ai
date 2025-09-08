import React, { useState, useRef, useEffect } from 'react';
import type { GeneratedPoster, GeneratedSocial, GeneratedMockup, GeneratedCustomerAd, GeneratedMultilingual, Generated3dRender, GeneratedQrCode } from '../types';

interface PosterPreviewProps {
  posters: GeneratedPoster[];
  socials: GeneratedSocial[];
  mockups: GeneratedMockup[];
  customerAds: GeneratedCustomerAd[];
  multilingualVersions: GeneratedMultilingual[];
  renders: Generated3dRender[];
  qrCode: GeneratedQrCode | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="19" cy="12" r="1"></circle>
        <circle cx="5" cy="12" r="1"></circle>
    </svg>
);

const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="text-xl font-semibold text-slate-200">AI Designer is at work...</h3>
        <p className="text-slate-400 mt-2">{message}</p>
    </div>
);

const EmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-slate-700 border-dashed rounded-2xl bg-slate-800/50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-20 w-20 text-slate-500 mb-4">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
        <h3 className="text-2xl font-bold text-slate-100">Your Campaign Assets Appear Here</h3>
        <p className="text-slate-400 mt-2 max-w-sm">Complete the form and generate your professional marketing materials.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-red-500/10 border-2 border-red-500/20 border-dashed rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-red-400 mb-4"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3 className="text-xl font-semibold text-red-200">Oops! Something went wrong.</h3>
        <p className="text-red-300 mt-1 max-w-md">{message}</p>
    </div>
);

const AssetCard: React.FC<{ title: string; imageUrl: string; downloadFilename: string }> = ({ title, imageUrl, downloadFilename }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDownload = (format: 'png' | 'jpeg') => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = imageUrl;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                if (format === 'jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                ctx.drawImage(image, 0, 0);

                const mimeType = `image/${format}`;
                const dataUrl = canvas.toDataURL(mimeType, 0.95);
                
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${downloadFilename.split('.')[0]}.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
        setIsMenuOpen(false);
    };

    return (
        <div className="group border border-slate-700 rounded-xl overflow-hidden bg-slate-800 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-indigo-900/50 hover:scale-[1.02] hover:border-slate-600">
            <img src={imageUrl} alt={title} className="w-full h-auto object-contain bg-slate-700/50" />
            <div className="p-3 flex justify-between items-center">
                <p className="text-sm font-medium text-slate-200 truncate" title={title}>{title}</p>
                <div ref={menuRef} className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
                        aria-label="Download options"
                    >
                        <MenuIcon />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-10">
                            <ul className="py-1 text-sm text-slate-300">
                                <li className='px-4 py-1 text-xs text-slate-500'>Download as</li>
                                <li>
                                    <button
                                        onClick={() => handleDownload('png')}
                                        className="block w-full text-left px-4 py-2 hover:bg-slate-700/50 font-medium"
                                    >
                                        PNG
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleDownload('jpeg')}
                                        className="block w-full text-left px-4 py-2 hover:bg-slate-700/50 font-medium"
                                    >
                                        JPG
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export const PosterPreview: React.FC<PosterPreviewProps> = ({ posters, socials, mockups, customerAds, multilingualVersions, renders, qrCode, isLoading, loadingMessage, error }) => {
    
    const hasResults = posters.length > 0 || socials.length > 0 || mockups.length > 0 || customerAds.length > 0 || multilingualVersions.length > 0 || renders.length > 0 || !!qrCode;

    const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
        <div>
            <h3 className="text-xl font-bold text-slate-100 mb-4 pb-2 border-b border-slate-700">{title}</h3>
            {children}
        </div>
    );

    const renderContent = () => {
        if (isLoading) return <LoadingIndicator message={loadingMessage} />;
        if (error) return <ErrorDisplay message={error} />;
        if (hasResults) {
            return (
                <div className="space-y-10 w-full">
                    {posters.length > 0 && (
                        <Section title="Poster Variations">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {posters.map((poster, index) => (
                                    <AssetCard
                                        key={`poster-${index}`}
                                        title={`Variation ${index + 1}`}
                                        imageUrl={poster.image}
                                        downloadFilename={`poster-variation-${index + 1}.png`}
                                    />
                                ))}
                            </div>
                        </Section>
                    )}
                    {renders.length > 0 && (
                        <Section title="3D Product Renders">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {renders.map((render, index) => (
                                    <AssetCard
                                        key={`render-${index}`}
                                        title={render.title || `3D Render ${index + 1}`}
                                        imageUrl={render.image}
                                        downloadFilename={`3d-render-${index + 1}.png`}
                                    />
                                ))}
                            </div>
                        </Section>
                    )}
                    {customerAds.length > 0 && (
                        <Section title="Customer-Generated Ads">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {customerAds.map((ad, index) => (
                                    <AssetCard
                                        key={`customer-ad-${index}`}
                                        title={`Customer Ad Variation ${index + 1}`}
                                        imageUrl={ad.image}
                                        downloadFilename={`customer-ad-${index + 1}.png`}
                                    />
                                ))}
                            </div>
                        </Section>
                    )}
                     {mockups.length > 0 && (
                        <Section title="3D Mockups">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {mockups.map((mockup, index) => (
                                    <AssetCard
                                        key={`mockup-${index}`}
                                        title={mockup.title || `Mockup ${index + 1}`}
                                        imageUrl={mockup.image}
                                        downloadFilename={`mockup-${index + 1}.png`}
                                    />
                                ))}
                            </div>
                        </Section>
                    )}
                    {multilingualVersions.length > 0 && (
                        <Section title="Multilingual Versions">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {multilingualVersions.map((version, index) => (
                                    <AssetCard
                                        key={`lang-${index}`}
                                        title={version.title || `Version ${index + 1}`}
                                        imageUrl={version.image}
                                        downloadFilename={`lang-version-${index + 1}.png`}
                                    />
                                ))}
                            </div>
                        </Section>
                    )}
                    {qrCode && (
                        <Section title="QR Code">
                            <div className="max-w-xs">
                                <AssetCard
                                    key="qr-code"
                                    title="Scannable QR Code"
                                    imageUrl={qrCode.image}
                                    downloadFilename="qr-code.png"
                                />
                            </div>
                        </Section>
                    )}
                    {socials.length > 0 && (
                        <Section title="Digital & Print Formats">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {socials.map((social, index) => (
                                    <AssetCard
                                        key={`social-${index}`}
                                        title={social.format}
                                        imageUrl={social.image}
                                        downloadFilename={`format-${social.format.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`}
                                    />
                                ))}
                            </div>
                        </Section>
                    )}
                </div>
            );
        }
        return <EmptyState />;
    };

    return (
        <div className="bg-slate-800/50 ring-1 ring-white/10 p-6 md:p-8 rounded-2xl shadow-2xl shadow-slate-950/50 min-h-[500px] flex flex-col">
             <h2 className="text-2xl font-bold text-slate-100 mb-6 pb-4 border-b border-slate-700">Your Campaign Assets</h2>
             <div className="w-full flex-grow flex items-center justify-center">
                 {renderContent()}
             </div>
        </div>
    );
};
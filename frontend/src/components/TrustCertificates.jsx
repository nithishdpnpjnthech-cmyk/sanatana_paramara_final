import React from 'react';

const TrustCertificates = ({ className = "" }) => {
    const certificates = [
        { name: 'Emapana', src: '/assets/certificate/emapana.png' },
        { name: 'FSSAI', src: '/assets/certificate/fssai.png' },
        { name: 'NABL', src: '/assets/certificate/nabl.png' },
        { name: 'Natural', src: '/assets/certificate/natural.png' }
    ];

    return (
        <div className={`pt-12 pb-6 bg-white border-t border-border/50 ${className}`}>
            <div className="container mx-auto px-4">
                {/* Certificates Row - Optimized for mobile to prevent overflow */}
                <div className="flex flex-row items-center justify-center gap-3 sm:gap-16 md:gap-24 mb-10">
                    {certificates.map((cert) => (
                        <div key={cert.name} className="flex-shrink-0 flex flex-col items-center">
                            <img
                                src={cert.src}
                                alt={`${cert.name} Certificate`}
                                className="h-10 sm:h-24 md:h-32 w-auto object-contain transition-all duration-300"
                                style={{
                                    filter: 'contrast(0.8) brightness(0.6) sepia(1) hue-rotate(120deg) saturate(2)'
                                }}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustCertificates;

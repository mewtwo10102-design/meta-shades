'use client'

import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, Upload, Sparkles, RefreshCw, Download, Share2, Copy, Check, X } from 'lucide-react';

export default function MetaShadesWebsite() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('original');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [showGallery, setShowGallery] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const [priceData, setPriceData] = useState({
    price: '$0.000042',
    change24h: '+156.7%',
    marketCap: '$4.2M',
    volume24h: '$890K',
    loading: true
  });

  // Fetch live price data from DexScreener
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/8D3JsKszFi8HYGidcE7HtmEAaNxEdUDLRVka71nbpump`);
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          setPriceData({
            price: `$${parseFloat(pair.priceUsd).toFixed(8)}`,
            change24h: `${pair.priceChange?.h24 > 0 ? '+' : ''}${pair.priceChange?.h24?.toFixed(2) || '0'}%`,
            marketCap: `$${(pair.fdv / 1000000).toFixed(2)}M`,
            volume24h: `$${(pair.volume?.h24 / 1000).toFixed(1)}K`,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
        setPriceData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchPriceData();
    const interval = setInterval(fetchPriceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const tokenInfo = {
    totalSupply: '1,000,000,000',
    burnt: '420,000,000',
    circulatingSupply: '580,000,000',
    holders: '12,847',
    contractAddress: '8D3JsKszFi8HYGidcE7HtmEAaNxEdUDLRVka71nbpump'
  };

  const glassesStyles = [
    { id: 'original', name: 'Original Oval', description: 'Classic Meta Shades look' },
    { id: 'aviator', name: 'Aviator', description: 'Top Gun vibes' },
    { id: 'square', name: 'Square', description: 'Blocky and bold' },
    { id: 'round', name: 'Round', description: 'Retro style' },
    { id: 'cat-eye', name: 'Cat Eye', description: 'Sassy and stylish' }
  ];

  const communityGallery = [
    { id: 1, name: 'Doge Shades', creator: 'CryptoMemer', likes: 420 },
    { id: 2, name: 'Pepe Vision', creator: 'MemeKing', likes: 690 },
    { id: 3, name: 'Moon Glasses', creator: 'ToTheMoon', likes: 1337 },
    { id: 4, name: 'Diamond Specs', creator: 'HODLer', likes: 888 },
    { id: 5, name: 'Laser Eyes', creator: 'BTCMaxi', likes: 2100 },
    { id: 6, name: 'NFT Frames', creator: 'ArtCollector', likes: 555 }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setGenerating(true);
    setResult('');
    setGeneratedImage(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const userImageData = reader.result;
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 3000,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Create an HTML page with a canvas that composites the Meta Shades character with custom glasses. The character is a smooth white circle with a smiling face holding their hand up to ${selectedStyle} style sunglasses.

Requirements:
- Draw the Meta Shades character (white circle, simple smile, hand gesture)
- Map the user's image onto the sunglasses lenses (style: ${selectedStyle})
- Apply these filters: brightness(${brightness}%), contrast(${contrast}%), saturate(${saturation}%)
- Black and white theme with the user's image visible in the glasses
- Make it 800x800px, centered, professional quality
- Use HTML5 Canvas with JavaScript

Return ONLY the complete HTML code with inline CSS and JavaScript. The user's image will be available as a data URL that you should reference as 'USER_IMAGE_DATA_URL' in the code (it will be replaced).`
                  },
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: selectedFile.type,
                      data: reader.result.split(',')[1]
                    }
                  }
                ]
              }
            ]
          })
        });

        const data = await response.json();
        const text = data.content
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join('\n');
        
        let htmlContent = text.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
        htmlContent = htmlContent.replace(/USER_IMAGE_DATA_URL/g, userImageData);
        
        setGeneratedImage(htmlContent);
        setResult('Your Meta Shades have been generated! 😎');
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setResult('Error generating Meta Shades. Please try again.');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = (platform) => {
    const text = 'Check out my custom Meta Shades! 😎 #MetaShades #SPECS';
    const url = window.location.href;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const handleCopy = () => {
    if (generatedImage) {
      navigator.clipboard.writeText(generatedImage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const blob = new Blob([generatedImage], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meta-shades.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-black/90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img 
                src="https://i.ibb.co/ccTmZjJH/IMG-0904.png"
                alt="Meta Shades"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Meta Shades</h1>
              <p className="text-sm text-gray-400">$SPECS</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#price" className="text-gray-300 hover:text-white transition">Price</a>
            <a href="#generator" className="text-gray-300 hover:text-white transition">Generator</a>
            <a href="#gallery" className="text-gray-300 hover:text-white transition">Gallery</a>
            <a href="#tokenomics" className="text-gray-300 hover:text-white transition">Tokenomics</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="mb-8">
          <img 
            src="https://i.ibb.co/ccTmZjJH/IMG-0904.png"
            alt="Meta Shades Character"
            className="w-48 h-48 mx-auto mb-6 animate-pulse object-contain"
          />
        </div>
        <h2 className="text-6xl font-bold mb-6">
          See The Future Through Meta Shades 😎
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
          Turn any meme into legendary shades! Upload your favorite image and watch it transform into the smoothest eyewear in crypto.
        </p>
        <div className="flex gap-4 justify-center">
          <a 
            href="https://pump.fun/8D3JsKszFi8HYGidcE7HtmEAaNxEdUDLRVka71nbpump"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-4 rounded-full text-lg transition transform hover:scale-105"
          >
            Buy $SPECS
          </a>
          <a 
            href="https://dexscreener.com/solana/8D3JsKszFi8HYGidcE7HtmEAaNxEdUDLRVka71nbpump"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-full text-lg transition transform hover:scale-105"
          >
            Chart
          </a>
        </div>
      </section>

      {/* Live Price Section */}
      <section id="price" className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              Live Price
            </h2>
            <button className="text-gray-400 hover:text-white">
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-black/40 rounded-lg p-6 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Price</p>
              <p className="text-3xl font-bold">{priceData.loading ? '...' : priceData.price}</p>
              <p className={`text-sm mt-1 ${priceData.change24h.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {priceData.loading ? '...' : priceData.change24h}
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-6 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Market Cap</p>
              <p className="text-2xl font-bold">{priceData.loading ? '...' : priceData.marketCap}</p>
            </div>
            <div className="bg-black/40 rounded-lg p-6 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">24h Volume</p>
              <p className="text-2xl font-bold">{priceData.loading ? '...' : priceData.volume24h}</p>
            </div>
            <div className="bg-black/40 rounded-lg p-6 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">Holders</p>
              <p className="text-2xl font-bold">{tokenInfo.holders}</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Shades Generator */}
      <section id="generator" className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-3">
              Meta Shades Generator
            </h2>
            <p className="text-gray-400 text-lg">
              Upload any image and watch it become the lenses on our iconic character! 🕶️✨
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* Left Column - Upload & Settings */}
            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-white mb-3 font-semibold text-lg">Upload Your Image</label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-600 transition bg-gray-900/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-300 text-lg">Click to upload your meme or image</p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF - Any image works!</p>
                  </label>
                </div>
                {preview && (
                  <div className="mt-4">
                    <p className="text-white text-center mb-2 font-semibold">Your Image:</p>
                    <img src={preview} alt="Preview" className="max-w-full h-48 mx-auto rounded-lg border-2 border-gray-700 object-contain" />
                  </div>
                )}
              </div>

              {/* Glasses Style Selection */}
              <div>
                <label className="block text-white mb-3 font-semibold">Glasses Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {glassesStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 rounded-lg border-2 transition ${
                        selectedStyle === style.id 
                          ? 'border-white bg-white/10' 
                          : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                      }`}
                    >
                      <p className="font-semibold text-sm">{style.name}</p>
                      <p className="text-xs text-gray-400">{style.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Adjustments */}
              <div className="space-y-4">
                <label className="block text-white font-semibold">Image Adjustments</label>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Brightness: {brightness}%</label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Contrast: {contrast}%</label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={contrast}
                    onChange={(e) => setContrast(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Saturation: {saturation}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div>
              <label className="block text-white mb-3 font-semibold text-lg">Preview</label>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 min-h-96 flex items-center justify-center">
                {generatedImage ? (
                  <iframe
                    srcDoc={generatedImage}
                    className="w-full h-96 border-0 rounded bg-white"
                    title="Generated Meta Shades"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Your Meta Shades will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedFile || generating}
            className="w-full bg-white hover:bg-gray-200 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold px-8 py-4 rounded-xl text-lg transition transform hover:scale-105 disabled:transform-none"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Creating Your Meta Shades...
              </span>
            ) : (
              'Generate Meta Shades!'
            )}
          </button>

          {/* Action Buttons */}
          {generatedImage && (
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleDownload}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={handleCopy}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy HTML'}
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-green-400 text-center">{result}</p>
            </div>
          )}
        </div>
      </section>

      {/* Community Gallery */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">Community Gallery</h2>
          <p className="text-gray-400 text-lg">Check out what the community is creating!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {communityGallery.map(item => (
            <div key={item.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-8">
                <img 
                  src="https://i.ibb.co/ccTmZjJH/IMG-0904.png"
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-2">by {item.creator}</p>
                <p className="text-sm text-gray-500">❤️ {item.likes} likes</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tokenomics */}
      <section id="tokenomics" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Tokenomics</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Supply Info */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-2xl font-bold mb-6">Supply Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-800">
                <span className="text-gray-400">Total Supply</span>
                <span className="font-bold text-xl">{tokenInfo.totalSupply}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-800">
                <span className="text-gray-400 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  Tokens Burnt
                </span>
                <span className="text-orange-400 font-bold text-xl">{tokenInfo.burnt}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Circulating Supply</span>
                <span className="font-bold text-xl">{tokenInfo.circulatingSupply}</span>
              </div>
            </div>
          </div>

          {/* Contract Info */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-2xl font-bold mb-6">Contract Info</h3>
            <div className="space-y-4">
              <div className="py-3 border-b border-gray-800">
                <span className="text-gray-400 block mb-2">Contract Address (Solana)</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-xs bg-black px-3 py-2 rounded block break-all flex-1">
                    {tokenInfo.contractAddress}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tokenInfo.contractAddress);
                      alert('Contract address copied!');
                    }}
                    className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded transition"
                    title="Copy address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-800">
                <span className="text-gray-400">Tax</span>
                <span className="text-green-400 font-bold text-xl">0%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-800">
                <span className="text-gray-400">Liquidity</span>
                <span className="text-green-400 font-bold text-xl">Locked 🔒</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Ownership</span>
                <span className="text-green-400 font-bold text-xl">Renounced ✓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Share Your Meta Shades</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
              >
                Share on Telegram
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                Share on Facebook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400 mb-2">© 2026 Meta Shades ($SPECS). All rights reserved.</p>
              <p className="text-gray-500 text-sm">Not financial advice. DYOR. See the future through Meta Shades! 😎</p>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://x.com/meta_shades_"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition"
                title="Follow us on X/Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/i/communities/2009843287008395366"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-full transition text-sm font-semibold"
title="Join our Community"
>
Community
</a>
<a 
             href="https://pump.fun/8D3JsKszFi8HYGidcE7HtmEAaNxEdUDLRVka71nbpump"
             target="_blank"
             rel="noopener noreferrer"
             className="bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-full transition text-sm font-semibold"
             title="Trade on Pump.fun"
           >
Pump.fun
</a>
</div>
</div>
</div>
</footer>
</div>
);
}

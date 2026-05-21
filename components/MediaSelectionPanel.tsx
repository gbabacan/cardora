"use client";

import { useState } from 'react';
import Image from 'next/image';

export interface Media {
  id: string;
  type: 'image' | 'gif' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  source: 'upload' | 'giphy' | 'unsplash';
  file?: File; // For file uploads
}

interface MediaSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (media: Media | null) => void;
}

export default function MediaSelectionPanel({
  isOpen,
  onClose,
  onSelectMedia
}: MediaSelectionPanelProps) {
  const [activeTab, setActiveTab] = useState<'image' | 'gif' | 'video' | 'audio'>('image');
  const [sourceTab, setSourceTab] = useState<'upload' | 'giphy' | 'unsplash' | 'record'>('upload');
  const [giphySearch, setGiphySearch] = useState('');
  const [unsplashSearch, setUnsplashSearch] = useState('');
  const [giphyResults, setGiphyResults] = useState<any[]>([]);
  const [unsplashResults, setUnsplashResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || 'YOUR_GIPHY_API_KEY';
  const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';

  const searchGiphy = async () => {
    if (!giphySearch.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(giphySearch)}&limit=20`
      );
      const data = await response.json();
      setGiphyResults(data.data || []);
    } catch (error) {
      console.error('Error fetching from Giphy:', error);
    }
    setLoading(false);
  };

  const searchUnsplash = async () => {
    if (!unsplashSearch.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashSearch)}&per_page=20`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      const data = await response.json();
      setUnsplashResults(data.results || []);
    } catch (error) {
      console.error('Error fetching from Unsplash:', error);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      let type: 'image' | 'gif' | 'video' | 'audio' = activeTab;

      // Override with detected type if different
      if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else if (file.type === 'image/gif') type = 'gif';
      else if (file.type.startsWith('image/')) type = 'image';

      onSelectMedia({
        id: Date.now().toString(),
        type,
        url,
        source: 'upload',
        file // Include the file object for uploading later
      } as any);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  // Audio recording functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      if (!window.isSecureContext) {
        alert('Audio recording requires HTTPS. Please use https:// or localhost.');
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support audio recording.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);

        setAudioPreview(url);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);

    } catch (error: any) {
      console.error('Error accessing microphone:', error);

      let errorMessage = 'Failed to access microphone. ';

      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow microphone access in your browser settings and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Microphone is already in use by another application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Could not satisfy audio constraints.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }

      alert(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);

      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
    }
  };

  const deleteAudioRecording = () => {
    setAudioPreview(null);
    setRecordingTime(0);
  };

  const useAudioRecording = () => {
    if (!audioPreview) return;

    fetch(audioPreview)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });

        onSelectMedia({
          id: Date.now().toString(),
          type: 'audio',
          url: audioPreview,
          source: 'upload',
          file
        } as any);

        onClose();
        setAudioPreview(null);
        setRecordingTime(0);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Add Media</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Media Type Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                setActiveTab('image');
                setSourceTab('upload');
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'image'
                  ? 'bg-[#2CB1A6] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📷 Image
            </button>
            <button
              onClick={() => {
                setActiveTab('gif');
                setSourceTab('upload');
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'gif'
                  ? 'bg-[#2CB1A6] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎬 GIF
            </button>
            <button
              onClick={() => {
                setActiveTab('video');
                setSourceTab('upload');
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'video'
                  ? 'bg-[#2CB1A6] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎥 Video
            </button>
            <button
              onClick={() => {
                setActiveTab('audio');
                setSourceTab('record');
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'audio'
                  ? 'bg-[#2CB1A6] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎵 Audio
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Source Tabs - show based on media type */}
          <div className="flex gap-2 mb-4 border-b border-gray-200 pb-4">
            <button
              onClick={() => setSourceTab('upload')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sourceTab === 'upload'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Upload
            </button>
            {(activeTab === 'gif') && (
              <button
                onClick={() => setSourceTab('giphy')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sourceTab === 'giphy'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Giphy
              </button>
            )}
            {(activeTab === 'image') && (
              <button
                onClick={() => setSourceTab('unsplash')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sourceTab === 'unsplash'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Unsplash
              </button>
            )}
            {(activeTab === 'audio') && (
              <button
                onClick={() => setSourceTab('record')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sourceTab === 'record'
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🎙️ Record
              </button>
            )}
          </div>

          {sourceTab === 'upload' && (
            <div className="flex flex-col items-center justify-center py-12">
              <input
                type="file"
                accept={
                  activeTab === 'image' ? 'image/*' :
                  activeTab === 'gif' ? 'image/gif' :
                  activeTab === 'video' ? 'video/*' :
                  activeTab === 'audio' ? 'audio/*' :
                  'image/*,video/*,audio/*'
                }
                onChange={handleFileUpload}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="cursor-pointer flex flex-col items-center gap-4 p-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#2CB1A6] transition-colors"
              >
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">Click to upload {activeTab}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTab === 'image' && 'PNG, JPG, JPEG, WebP'}
                    {activeTab === 'gif' && 'GIF files'}
                    {activeTab === 'video' && 'MP4, WebM, MOV'}
                    {activeTab === 'audio' && 'MP3, WAV, OGG'}
                  </p>
                </div>
              </label>
              <button
                onClick={() => {
                  onSelectMedia(null);
                  onClose();
                }}
                className="mt-6 px-6 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Remove Media
              </button>
            </div>
          )}

          {sourceTab === 'giphy' && activeTab === 'gif' && (
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={giphySearch}
                  onChange={(e) => setGiphySearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchGiphy()}
                  placeholder="Search Giphy..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2CB1A6]"
                />
                <button
                  onClick={searchGiphy}
                  className="px-6 py-2 bg-[#2CB1A6] text-white rounded-lg hover:bg-[#25A094] transition-colors"
                >
                  Search
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">Loading...</div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {giphyResults.map((gif) => (
                    <button
                      key={gif.id}
                      onClick={() => {
                        onSelectMedia({
                          id: gif.id,
                          type: 'gif',
                          url: gif.images.original.url,
                          thumbnail: gif.images.fixed_height_small.url,
                          source: 'giphy'
                        });
                        onClose();
                      }}
                      className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <img src={gif.images.fixed_height_small.url} alt={gif.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {sourceTab === 'unsplash' && activeTab === 'image' && (
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={unsplashSearch}
                  onChange={(e) => setUnsplashSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchUnsplash()}
                  placeholder="Search Unsplash..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2CB1A6]"
                />
                <button
                  onClick={searchUnsplash}
                  className="px-6 py-2 bg-[#2CB1A6] text-white rounded-lg hover:bg-[#25A094] transition-colors"
                >
                  Search
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">Loading...</div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {unsplashResults.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => {
                        onSelectMedia({
                          id: photo.id,
                          type: 'image',
                          url: photo.urls.regular,
                          thumbnail: photo.urls.small,
                          source: 'unsplash'
                        });
                        onClose();
                      }}
                      className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <img src={photo.urls.small} alt={photo.alt_description} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {sourceTab === 'record' && activeTab === 'audio' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {audioPreview ? (
                /* Audio Preview */
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#2CB1A6] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Audio Recording</p>
                        <p className="text-xs text-gray-600">Duration: {formatTime(recordingTime)}</p>
                      </div>
                    </div>
                    <audio
                      src={audioPreview}
                      controls
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={deleteAudioRecording}
                      className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Delete Recording
                    </button>
                    <button
                      type="button"
                      onClick={useAudioRecording}
                      className="flex-1 px-4 py-2 bg-[#2CB1A6] hover:bg-[#25A094] text-white rounded-lg font-medium transition-colors"
                    >
                      Use Recording
                    </button>
                  </div>
                </div>
              ) : (
                /* Recording Controls */
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#2CB1A6]/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    {isRecording ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                          <p className="text-lg font-semibold text-red-600">Recording... {formatTime(recordingTime)}</p>
                        </div>
                        <p className="text-sm text-gray-600">Click stop when finished</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-900 font-medium mb-1">Record an audio message</p>
                        <p className="text-sm text-gray-600">Click the button below to start recording</p>
                      </div>
                    )}
                  </div>

                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" />
                      </svg>
                      Stop Recording
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-6 py-3 bg-[#2CB1A6] hover:bg-[#25A094] text-white rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      Start Recording
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
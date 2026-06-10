"use client";

import { useState } from "react";
import Image from "next/image";

interface AddMessageModalProps {
  boardId: string;
  boardShortId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (messageId?: string, editToken?: string) => void;
  onError?: (message: string) => void;
}

export default function AddMessageModal({
  boardId,
  boardShortId,
  isOpen,
  onClose,
  onSuccess,
  onError
}: AddMessageModalProps) {
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaTab, setMediaTab] = useState<'none' | 'image' | 'gif' | 'video' | 'audio'>('none');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Image source: 'upload' or 'unsplash'
  const [imageSource, setImageSource] = useState<'upload' | 'unsplash'>('upload');

  // GIF source: 'upload' or 'giphy'
  const [gifSource, setGifSource] = useState<'upload' | 'giphy'>('upload');

  // GIF search state
  const [gifSearchQuery, setGifSearchQuery] = useState('');
  const [gifResults, setGifResults] = useState<any[]>([]);
  const [isSearchingGifs, setIsSearchingGifs] = useState(false);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [gifFile, setGifFile] = useState<File | null>(null);
  const [gifPreview, setGifPreview] = useState<string | null>(null);

  // Unsplash search state
  const [unsplashSearchQuery, setUnsplashSearchQuery] = useState('');
  const [unsplashResults, setUnsplashResults] = useState<any[]>([]);
  const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false);
  const [selectedUnsplash, setSelectedUnsplash] = useState<{url: string, author: string, authorUrl: string} | null>(null);

  // Video upload state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Audio recording state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

  const [selectedFont, setSelectedFont] = useState('Open Sans');
  const [selectedColor, setSelectedColor] = useState('#0B1F2A');

  // Font options
  const fonts = [
    'Inter', 'Poppins', 'Montserrat', 'Raleway', 'Lato', 'Open Sans',
    'Playfair Display', 'Merriweather', 'Lora', 'Crimson Text',
    'Dancing Script', 'Pacifico', 'Great Vibes', 'Satisfy', 'Cookie',
    'Caveat', 'Indie Flower', 'Permanent Marker', 'Shadows Into Light'
  ];

  const searchGiphy = async (query: string) => {
    if (!query.trim()) {
      setGifResults([]);
      return;
    }

    setIsSearchingGifs(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=20&rating=g`
      );
      const data = await response.json();

      if (data.data) {
        setGifResults(data.data);
      }
    } catch (error) {
      console.error('Error searching GIFs:', error);
      if (onError) {
        onError('Failed to search GIFs. Please try again.');
      }
    } finally {
      setIsSearchingGifs(false);
    }
  };

  const searchUnsplash = async (query: string) => {
    if (!query.trim()) {
      setUnsplashResults([]);
      return;
    }

    setIsSearchingUnsplash(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&client_id=${apiKey}`
      );
      const data = await response.json();

      if (data.results) {
        setUnsplashResults(data.results);
      }
    } catch (error) {
      console.error('Error searching Unsplash:', error);
      if (onError) {
        onError('Failed to search Unsplash. Please try again.');
      }
    } finally {
      setIsSearchingUnsplash(false);
    }
  };

  const handleSelectGif = (gifUrl: string) => {
    setSelectedGif(gifUrl);
    setGifFile(null);
    setGifPreview(null);
    setImageFile(null);
    setImagePreview(null);
    setSelectedUnsplash(null);
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handleGifFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        if (onError) {
          onError('File size must be less than 10MB');
        }
        e.target.value = '';
        return;
      }

      // Check if it's a GIF
      if (!file.type.includes('gif')) {
        if (onError) {
          onError('Please upload a GIF file');
        }
        e.target.value = '';
        return;
      }

      setGifFile(file);
      setSelectedGif(null);
      setImageFile(null);
      setImagePreview(null);
      setSelectedUnsplash(null);
      setVideoFile(null);
      setVideoPreview(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setGifPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 50MB for videos)
      if (file.size > 50 * 1024 * 1024) {
        if (onError) {
          onError('Video file size must be less than 50MB');
        }
        e.target.value = '';
        return;
      }

      // Check if it's a video
      if (!file.type.includes('video')) {
        if (onError) {
          onError('Please upload a video file');
        }
        e.target.value = '';
        return;
      }

      setVideoFile(file);
      setImageFile(null);
      setImagePreview(null);
      setSelectedUnsplash(null);
      setGifFile(null);
      setGifPreview(null);
      setSelectedGif(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectUnsplash = (photo: any) => {
    setSelectedUnsplash({
      url: photo.urls.regular,
      author: photo.user.name,
      authorUrl: photo.user.links.html
    });
    setImageFile(null);
    setImagePreview(null);
    setSelectedGif(null);
    setVideoFile(null);
    setVideoPreview(null);

    // Trigger download endpoint (Unsplash API requirement)
    if (photo.links.download_location) {
      const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
      fetch(`${photo.links.download_location}?client_id=${apiKey}`).catch(() => {});
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        if (onError) {
          onError('File size must be less than 10MB');
        }
        // Clear the file input
        e.target.value = '';
        return;
      }

      setImageFile(file);
      setSelectedUnsplash(null);
      setSelectedGif(null);
      setVideoFile(null);
      setVideoPreview(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // WYSIWYG formatting functions
  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    const editor = document.getElementById('message-editor');
    if (editor) {
      setMessageContent(editor.innerHTML);
      editor.focus();
    }
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setMessageContent(content);
  };

  // Initialize editor content only once when modal opens
  const editorRef = (element: HTMLDivElement | null) => {
    if (element && !messageContent) {
      element.innerHTML = '';
    }
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    applyFormat('fontName', font);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    applyFormat('foreColor', color);
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      // Check if we're in a secure context
      if (!window.isSecureContext) {
        if (onError) {
          onError('Audio recording requires HTTPS. Please use https:// or localhost.');
        }
        return;
      }

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (onError) {
          onError('Your browser does not support audio recording.');
        }
        return;
      }

      // Request microphone permission
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

        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(blob));

        // Clear other media
        setImageFile(null);
        setImagePreview(null);
        setSelectedGif(null);
        setGifFile(null);
        setGifPreview(null);
        setVideoFile(null);
        setVideoPreview(null);
        setSelectedUnsplash(null);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
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

      if (onError) {
        onError(errorMessage);
      }
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
    setAudioFile(null);
    setAudioPreview(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('board_id', boardId);
      formData.append('contributor_name', contributorName);
      if (contributorEmail) {
        formData.append('contributor_email', contributorEmail);
      }
      formData.append('content', messageContent);
      formData.append('is_anonymous', 'false');

      // Add media if selected
      if (imageFile && mediaTab === 'image') {
        formData.append('media_file', imageFile);
        formData.append('media_type', 'image');
      } else if (selectedUnsplash && mediaTab === 'image') {
        formData.append('unsplash_url', selectedUnsplash.url);
        formData.append('unsplash_author', selectedUnsplash.author);
        formData.append('unsplash_author_url', selectedUnsplash.authorUrl);
        formData.append('media_type', 'image');
      } else if (gifFile && mediaTab === 'gif') {
        formData.append('media_file', gifFile);
        formData.append('media_type', 'gif');
      } else if (selectedGif && mediaTab === 'gif') {
        formData.append('gif_url', selectedGif);
        formData.append('media_type', 'gif');
      } else if (videoFile && mediaTab === 'video') {
        formData.append('media_file', videoFile);
        formData.append('media_type', 'video');
      } else if (audioFile && mediaTab === 'audio') {
        formData.append('media_file', audioFile);
        formData.append('media_type', 'audio');
      }

      const response = await fetch('/api/messages/create', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to post message');
      }

      // Reset form
      setContributorName('');
      setContributorEmail('');
      setMessageContent('');
      setImageFile(null);
      setImagePreview(null);
      setSelectedGif(null);
      setGifFile(null);
      setGifPreview(null);
      setVideoFile(null);
      setVideoPreview(null);
      setAudioFile(null);
      setAudioPreview(null);
      setSelectedUnsplash(null);
      setGifSearchQuery('');
      setGifResults([]);
      setUnsplashSearchQuery('');
      setUnsplashResults([]);
      setImageSource('upload');
      setGifSource('upload');
      setMediaTab('none');
      setRecordingTime(0);

      // Clear contentEditable div
      const editor = document.getElementById('message-editor');
      if (editor) {
        editor.innerHTML = '';
      }

      // Call success callback with token for edit/delete capability
      onSuccess(result.data?.id, result.editToken);

    } catch (error: any) {
      console.error('Error posting message:', error);
      if (onError) {
        onError(error.message || 'Failed to post message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="p-6 border-b border-[#E5EAF0] flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0B1F2A]">✍️ Add Your Message</h2>
            <button
              onClick={onClose}
              className="text-[#5B6B75] hover:text-[#0B1F2A] text-3xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Your Name */}
            <div>
              <label className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
              />
            </div>

            {/* Your Email (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                Your Email <span className="text-[#5B6B75] font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={contributorEmail}
                onChange={(e) => setContributorEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
              />
              <p className="text-xs text-[#5B6B75] mt-1">
                We'll use this to notify you when the board is delivered
              </p>
            </div>

            {/* Your Message */}
            <div>
              <label className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                Your Message <span className="text-red-500">*</span>
              </label>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-2 mb-2 p-2 bg-[#F7FAFC] rounded-lg border border-[#E5EAF0]">
                {/* Text Formatting */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => applyFormat('bold')}
                    className="px-3 py-1.5 bg-white hover:bg-[#E8F5F4] border border-[#E5EAF0] rounded text-sm font-bold transition-colors"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('italic')}
                    className="px-3 py-1.5 bg-white hover:bg-[#E8F5F4] border border-[#E5EAF0] rounded text-sm italic transition-colors"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('underline')}
                    className="px-3 py-1.5 bg-white hover:bg-[#E8F5F4] border border-[#E5EAF0] rounded text-sm underline transition-colors"
                    title="Underline"
                  >
                    U
                  </button>
                </div>

                <div className="w-px h-6 bg-[#E5EAF0]" />

                {/* Font Family Selector */}
                <select
                  value={selectedFont}
                  onChange={(e) => handleFontChange(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-[#E5EAF0] rounded text-sm transition-colors focus:border-[#2CB1A6] focus:outline-none"
                  style={{ fontFamily: selectedFont }}
                >
                  {fonts.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>

                <div className="w-px h-6 bg-[#E5EAF0]" />

                {/* Font Color Picker */}
                <div className="flex items-center gap-2">
                  <label htmlFor="font-color" className="text-xs font-medium text-[#5B6B75]">
                    Color:
                  </label>
                  <input
                    id="font-color"
                    type="color"
                    value={selectedColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-10 h-8 rounded border border-[#E5EAF0] cursor-pointer"
                    title="Text Color"
                  />
                </div>
              </div>

              {/* WYSIWYG Editor */}
              <div
                id="message-editor"
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                className="w-full min-h-[150px] px-4 py-3 border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors bg-white overflow-y-auto"
                style={{ maxHeight: '300px' }}
                suppressContentEditableWarning
              />
              <p className="text-xs text-[#5B6B75] mt-1">
                {messageContent.replace(/<[^>]*>/g, '').length} characters • Use the toolbar to format your text
              </p>
            </div>

            {/* Media Tabs */}
            <div>
              <label className="block text-sm font-semibold text-[#0B1F2A] mb-3">
                Add Media <span className="text-[#5B6B75] font-normal">(Optional)</span>
              </label>
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setMediaTab('none');
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mediaTab === 'none'
                      ? 'bg-[#2CB1A6] text-white'
                      : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                  }`}
                >
                  No Media
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab('image')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mediaTab === 'image'
                      ? 'bg-[#2CB1A6] text-white'
                      : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                  }`}
                >
                  📷 Photo
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab('gif')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mediaTab === 'gif'
                      ? 'bg-[#2CB1A6] text-white'
                      : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                  }`}
                >
                  🎬 GIF
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab('video')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mediaTab === 'video'
                      ? 'bg-[#2CB1A6] text-white'
                      : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                  }`}
                >
                  🎥 Video
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab('audio')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mediaTab === 'audio'
                      ? 'bg-[#2CB1A6] text-white'
                      : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                  }`}
                >
                  🎙️ Audio
                </button>
              </div>

              {/* Image Upload or Unsplash */}
              {mediaTab === 'image' && (
                <div className="space-y-4">
                  {/* Toggle between Upload and Unsplash */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setImageSource('upload')}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        imageSource === 'upload'
                          ? 'bg-[#2CB1A6] text-white'
                          : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                      }`}
                    >
                      📤 Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSource('unsplash')}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        imageSource === 'unsplash'
                          ? 'bg-[#2CB1A6] text-white'
                          : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                      }`}
                    >
                      🔍 Search Unsplash
                    </button>
                  </div>

                  {/* Upload Section */}
                  {imageSource === 'upload' && (
                    <div className="border-2 border-dashed border-[#E5EAF0] rounded-lg p-6">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-64 mx-auto rounded-lg"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <div className="mb-4">
                              <svg className="w-12 h-12 mx-auto text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-[#0B1F2A] font-medium mb-1">Click to upload an image</p>
                            <p className="text-sm text-[#5B6B75]">PNG, JPG, GIF up to 10MB</p>
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Unsplash Search Section */}
                  {imageSource === 'unsplash' && (
                    <div className="border-2 border-[#E5EAF0] rounded-lg p-4">
                      {selectedUnsplash ? (
                        /* Selected Unsplash Photo Preview */
                        <div className="space-y-4">
                          <div className="relative">
                            <img
                              src={selectedUnsplash.url}
                              alt="Selected photo"
                              className="max-h-64 mx-auto rounded-lg"
                            />
                          </div>
                          <p className="text-xs text-center text-[#5B6B75]">
                            Photo by{' '}
                            <a
                              href={`${selectedUnsplash.authorUrl}?utm_source=Cardora&utm_medium=referral`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-[#2CB1A6]"
                            >
                              {selectedUnsplash.author}
                            </a>
                            {' '}on{' '}
                            <a
                              href="https://unsplash.com?utm_source=Cardora&utm_medium=referral"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-[#2CB1A6]"
                            >
                              Unsplash
                            </a>
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedUnsplash(null)}
                            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                          >
                            Remove Photo
                          </button>
                        </div>
                      ) : (
                        /* Unsplash Search */
                        <div className="space-y-4">
                          {/* Search Bar */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={unsplashSearchQuery}
                              onChange={(e) => setUnsplashSearchQuery(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  searchUnsplash(unsplashSearchQuery);
                                }
                              }}
                              placeholder="Search photos... (e.g., nature, celebration)"
                              className="flex-1 px-4 py-2 border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => searchUnsplash(unsplashSearchQuery)}
                              disabled={isSearchingUnsplash}
                              className="px-4 py-2 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors disabled:bg-gray-400"
                            >
                              {isSearchingUnsplash ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              )}
                            </button>
                          </div>

                          {/* Unsplash Results Grid */}
                          {unsplashResults.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                              {unsplashResults.map((photo) => (
                                <button
                                  key={photo.id}
                                  type="button"
                                  onClick={() => handleSelectUnsplash(photo)}
                                  className="relative aspect-square overflow-hidden rounded-lg hover:ring-2 hover:ring-[#2CB1A6] transition-all"
                                >
                                  <img
                                    src={photo.urls.small}
                                    alt={photo.alt_description || 'Unsplash photo'}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          ) : unsplashSearchQuery && !isSearchingUnsplash ? (
                            <div className="text-center py-8 text-[#5B6B75]">
                              <p>No photos found. Try a different search term.</p>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-[#5B6B75]">
                              <svg className="w-12 h-12 mx-auto mb-2 text-[#E5EAF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="font-medium">Search for photos</p>
                              <p className="text-sm">Powered by Unsplash</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* GIF Upload or Giphy */}
              {mediaTab === 'gif' && (
                <div className="space-y-4">
                  {/* Toggle between Upload and Giphy */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGifSource('upload')}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        gifSource === 'upload'
                          ? 'bg-[#2CB1A6] text-white'
                          : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                      }`}
                    >
                      📤 Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setGifSource('giphy')}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        gifSource === 'giphy'
                          ? 'bg-[#2CB1A6] text-white'
                          : 'bg-[#F7FAFC] text-[#5B6B75] hover:bg-[#E5EAF0]'
                      }`}
                    >
                      🔍 Search Giphy
                    </button>
                  </div>

                  {/* Upload Section */}
                  {gifSource === 'upload' && (
                    <div className="border-2 border-dashed border-[#E5EAF0] rounded-lg p-6">
                      {gifPreview ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <img
                              src={gifPreview}
                              alt="Preview"
                              className="max-h-64 mx-auto rounded-lg"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setGifFile(null);
                              setGifPreview(null);
                            }}
                            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                          >
                            Remove GIF
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <input
                            type="file"
                            accept="image/gif"
                            onChange={handleGifFileChange}
                            className="hidden"
                            id="gif-upload"
                          />
                          <label htmlFor="gif-upload" className="cursor-pointer">
                            <div className="mb-4">
                              <svg className="w-12 h-12 mx-auto text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                              </svg>
                            </div>
                            <p className="text-[#0B1F2A] font-medium mb-1">Click to upload a GIF</p>
                            <p className="text-sm text-[#5B6B75]">GIF up to 10MB</p>
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Giphy Search Section */}
                  {gifSource === 'giphy' && (
                    <div className="border-2 border-[#E5EAF0] rounded-lg p-4">
                      {selectedGif ? (
                        /* Selected GIF Preview */
                        <div className="space-y-4">
                          <div className="relative">
                            <img
                              src={selectedGif}
                              alt="Selected GIF"
                              className="max-h-64 mx-auto rounded-lg"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedGif(null)}
                            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                          >
                            Remove GIF
                          </button>
                        </div>
                      ) : (
                        /* GIF Search */
                        <div className="space-y-4">
                      {/* Search Bar */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={gifSearchQuery}
                          onChange={(e) => setGifSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              searchGiphy(gifSearchQuery);
                            }
                          }}
                          placeholder="Search GIFs... (e.g., happy, celebrate)"
                          className="flex-1 px-4 py-2 border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => searchGiphy(gifSearchQuery)}
                          disabled={isSearchingGifs}
                          className="px-4 py-2 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors disabled:bg-gray-400"
                        >
                          {isSearchingGifs ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* GIF Results Grid */}
                      {gifResults.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                          {gifResults.map((gif) => (
                            <button
                              key={gif.id}
                              type="button"
                              onClick={() => handleSelectGif(gif.images.fixed_height.url)}
                              className="relative aspect-square overflow-hidden rounded-lg hover:ring-2 hover:ring-[#2CB1A6] transition-all"
                            >
                              <img
                                src={gif.images.fixed_height_small.url}
                                alt={gif.title}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      ) : gifSearchQuery && !isSearchingGifs ? (
                        <div className="text-center py-8 text-[#5B6B75]">
                          <p>No GIFs found. Try a different search term.</p>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-[#5B6B75]">
                          <svg className="w-12 h-12 mx-auto mb-2 text-[#E5EAF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                          <p className="font-medium">Search for GIFs</p>
                          <p className="text-sm">Powered by Giphy</p>
                        </div>
                      )}
                    </div>
                  )}
                    </div>
                  )}
                </div>
              )}

              {/* Video Upload */}
              {mediaTab === 'video' && (
                <div className="border-2 border-dashed border-[#E5EAF0] rounded-lg p-6">
                  {videoPreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <video
                          src={videoPreview}
                          controls
                          className="max-h-64 mx-auto rounded-lg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreview(null);
                        }}
                        className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Remove Video
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <div className="mb-4">
                          <svg className="w-12 h-12 mx-auto text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-[#0B1F2A] font-medium mb-1">Click to upload a video</p>
                        <p className="text-sm text-[#5B6B75]">MP4, MOV, AVI up to 50MB</p>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Audio Recording */}
              {mediaTab === 'audio' && (
                <div className="border-2 border-dashed border-[#E5EAF0] rounded-lg p-6">
                  {audioPreview ? (
                    /* Audio Preview */
                    <div className="space-y-4">
                      <div className="bg-[#F7FAFC] rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#2CB1A6] flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#0B1F2A]">Audio Recording</p>
                            <p className="text-xs text-[#5B6B75]">Duration: {formatTime(recordingTime)}</p>
                          </div>
                        </div>
                        <audio
                          src={audioPreview}
                          controls
                          className="w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={deleteAudioRecording}
                        className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Delete Recording
                      </button>
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
                            <p className="text-sm text-[#5B6B75]">Click stop when finished</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-[#0B1F2A] font-medium mb-1">Record an audio message</p>
                            <p className="text-sm text-[#5B6B75]">Click the button below to start recording</p>
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
                          className="px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto"
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

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#E5EAF0]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-white border-2 border-[#E5EAF0] text-[#5B6B75] hover:border-[#2CB1A6] hover:text-[#2CB1A6] rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !contributorName.trim() || !messageContent.trim()}
                className="flex-1 px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
"use client"

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, X, Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, AlertCircle, Gauge } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

// Team logo mapping with actual image paths
const TEAM_LOGOS = {
  'TT': '/team-logos/Telugu Titans.jpeg',
  'BB': '/team-logos/Bengaluru Bulls.png',
  'BW': '/team-logos/Bengal Warriors.png',
  'DD': '/team-logos/Dabang Delhi.jpeg',
  'GG': '/team-logos/Gujarat Giants.jpeg',
  'HS': '/team-logos/Haryana Steelers.jpeg',
  'JP': '/team-logos/Jaipur Pink Panthers.png',
  'PP': '/team-logos/Patna Pirates.jpeg',
  'PU': '/team-logos/Puneri Paltan.jpeg',
  'TN': '/team-logos/Tamil Thalaivas.png',
  'UM': '/team-logos/U Mumba.png',
  'UP': '/team-logos/U.P. Yoddhas.jpeg'
}

// TeamLogo component for consistent team logo display
const TeamLogo = ({ teamCode, size = 'md', showFallback = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  }
  
  const logoPath = TEAM_LOGOS[teamCode]
  
  if (logoPath) {
    return (
      <img 
        src={logoPath} 
        alt={`${teamCode} logo`}
        className={`${sizeClasses[size]} object-cover rounded-full shadow-lg border border-white/20 hover:scale-105 transition-transform duration-200 ${className}`}
        onError={(e) => {
          if (showFallback) {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }
        }}
      />
    )
  }
  
  if (showFallback) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border border-white/20 ${className}`}>
        {teamCode}
      </div>
    )
  }
  
  return null
}

export default function VideoPlayer({ isOpen, onClose, raidId, raidData }) {
  const [videoUrl, setVideoUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showPlayOverlay, setShowPlayOverlay] = useState(false)
  const videoRef = useRef(null)
  const playPromiseRef = useRef(null)

  useEffect(() => {
    if (isOpen && (raidId || raidData?.video_url)) {
      loadVideoUrl()
    }
  }, [isOpen, raidId, raidData])

  // Reset video state when video URL changes
  useEffect(() => {
    if (videoUrl) {
      console.log('Video URL changed:', videoUrl)
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
      setError(null)
    }
  }, [videoUrl])

  // Apply playback speed when it changes
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  // Debug video element state
  useEffect(() => {
    const video = videoRef.current
    if (video && videoUrl) {
      console.log('Video element state:', {
        src: video.src,
        readyState: video.readyState,
        networkState: video.networkState,
        paused: video.paused,
        muted: video.muted,
        volume: video.volume
      })
    }
  }, [videoUrl])

  // Auto-play video when it's ready
  useEffect(() => {
    const video = videoRef.current
    if (video && videoUrl && !isLoading && !error) {
      const attemptAutoPlay = async () => {
        try {
          console.log('Attempting to auto-play video')
          playPromiseRef.current = video.play()
          await playPromiseRef.current
          playPromiseRef.current = null
          setShowPlayOverlay(false)
          console.log('Video auto-played successfully')
          return true
        } catch (playErr) {
          console.error('Auto-play failed:', playErr)
          playPromiseRef.current = null
          if (playErr.name === 'NotAllowedError') {
            console.log('Auto-play blocked by browser, showing play overlay')
            setShowPlayOverlay(true)
          } else {
            console.log('Auto-play failed for other reason, showing play overlay')
            setShowPlayOverlay(true)
          }
          return false
        }
      }

      const handleCanPlay = async () => {
        try {
          // Clear any existing play promise
          if (playPromiseRef.current) {
            playPromiseRef.current = null
          }
          
          console.log('Video is ready to play, attempting auto-play')
          
          // Try to play immediately when video is ready
          if (video && video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            const success = await attemptAutoPlay()
            if (!success) {
              // Try again after a short delay
              setTimeout(async () => {
                if (video && video.readyState >= 2) {
                  await attemptAutoPlay()
                }
              }, 1000)
            }
          } else {
            console.log('Video not ready yet, showing play overlay')
            setShowPlayOverlay(true)
          }
        } catch (err) {
          console.error('Auto-play setup failed:', err)
          setShowPlayOverlay(true)
        }
      }

      // Wait for the video to be ready
      if (video.readyState >= 2) {
        handleCanPlay()
      } else {
        video.addEventListener('canplay', handleCanPlay, { once: true })
        video.addEventListener('loadeddata', handleCanPlay, { once: true })
        video.addEventListener('canplaythrough', handleCanPlay, { once: true })
      }

      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('loadeddata', handleCanPlay)
        video.removeEventListener('canplaythrough', handleCanPlay)
      }
    }
  }, [videoUrl, isLoading, error])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const video = videoRef.current
      if (video) {
        video.pause()
        video.load()
      }
      if (playPromiseRef.current) {
        playPromiseRef.current = null
      }
    }
  }, [])

  const loadVideoUrl = async () => {
    // If raidData has video_url directly (analytics), use it
    if (raidData?.video_url && raidData.video_url !== "Video not available") {
      // Clean and validate the video URL
      let cleanUrl = raidData.video_url.trim()
      if (cleanUrl.startsWith("'") && cleanUrl.endsWith("'")) {
        cleanUrl = cleanUrl.slice(1, -1) // Remove surrounding quotes
      }
      
             // Handle double URL encoding only if needed
       try {
         // Check if URL is double-encoded (contains %25)
         if (cleanUrl.includes('%25')) {
           console.log('Detected double-encoded URL, decoding twice')
           cleanUrl = decodeURIComponent(decodeURIComponent(cleanUrl))
         }
         // Don't decode or re-encode URLs that are already properly formatted
         // The database already contains correctly encoded URLs
       } catch (e) {
         console.warn('URL parsing failed, using original:', cleanUrl)
       }
      
      console.log('Cleaned video URL:', cleanUrl)
      setVideoUrl(cleanUrl)
      return
    }

    // Otherwise, fetch video URL using raid_id (dashboard)
    if (!raidId) {
      setError("No video available for this raid")
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/video/url?raid_id=${raidId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load video')
      }
      
      const data = await response.json()
      setVideoUrl(data.url)
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVideoLoad = (event) => {
    const video = event.target
    setDuration(video.duration)
    // Set initial playback speed
    video.playbackRate = playbackSpeed
  }

  const handleTimeUpdate = (event) => {
    const video = event.target
    setCurrentTime(video.currentTime)
  }

  const handlePlayPause = async () => {
    const video = videoRef.current
    if (!video) return

    try {
      if (isPlaying) {
        video.pause()
        setIsPlaying(false)
        // Cancel any pending play promise
        if (playPromiseRef.current) {
          playPromiseRef.current = null
        }
      } else {
        // Cancel any existing play promise
        if (playPromiseRef.current) {
          playPromiseRef.current = null
        }
        
        console.log('Manual play button clicked')
        setShowPlayOverlay(false)
        
        // Ensure video is loaded and ready
        if (video.readyState < 2) {
          console.log('Video not ready, loading first')
          setIsLoading(true)
          video.load()
          
          const handleCanPlay = async () => {
            try {
              console.log('Video loaded, attempting to play')
              playPromiseRef.current = video.play()
              await playPromiseRef.current
              playPromiseRef.current = null
              setIsLoading(false)
              console.log('Video started playing successfully')
            } catch (err) {
              console.error('Error playing video after load:', err)
              setIsLoading(false)
              if (err.name !== 'AbortError') {
                setError('Failed to play video')
              }
            }
          }
          video.addEventListener('canplay', handleCanPlay, { once: true })
        } else {
          // Video is ready, try to play immediately
          try {
            console.log('Video ready, attempting to play')
            playPromiseRef.current = video.play()
            await playPromiseRef.current
            playPromiseRef.current = null
            console.log('Video started playing successfully')
          } catch (err) {
            console.error('Error playing ready video:', err)
            if (err.name !== 'AbortError') {
              setError('Failed to play video')
            }
          }
        }
      }
    } catch (err) {
      console.error('Error with video playback:', err)
      if (err.name !== 'AbortError') {
        setError('Failed to play video')
      }
      setIsPlaying(false)
      playPromiseRef.current = null
    }
  }

  const handleMuteToggle = () => {
    const video = videoRef.current
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value)
    const video = videoRef.current
    if (video) {
      video.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const handlePlaybackSpeedChange = (speed) => {
    const video = videoRef.current
    if (video) {
      video.playbackRate = speed
      setPlaybackSpeed(speed)
    }
  }

  const handleSeek = (event) => {
    const video = videoRef.current
    const seekTime = parseFloat(event.target.value)
    if (video) {
      video.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }

  const handleFullscreen = () => {
    const video = videoRef.current
    if (video) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        video.requestFullscreen()
      }
    }
  }

  const handleRestart = async () => {
    const video = videoRef.current
    if (video) {
      try {
        // Cancel any pending play promise
        if (playPromiseRef.current) {
          playPromiseRef.current = null
        }
        
        video.currentTime = 0
        setCurrentTime(0)
        playPromiseRef.current = video.play()
        await playPromiseRef.current
        playPromiseRef.current = null
        // Don't set isPlaying here - let the onPlay event handle it
      } catch (err) {
        console.error('Error restarting video:', err)
        if (err.name !== 'AbortError') {
          setError('Failed to restart video')
        }
        setIsPlaying(false)
        playPromiseRef.current = null
      }
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const cleanPlayerName = (name) => {
    if (!name) return 'Unknown Player'
    
    // If it's already a clean name (from analytics), return as is
    if (name && !name.includes('_')) return name
    
    // Extract the first part before underscore (actual player name)
    const parts = name.split('_')
    return parts[0] || 'Unknown Player'
  }

  const handleClose = () => {
    // Pause and reset video before closing
    const video = videoRef.current
    if (video) {
      // Cancel any pending play requests
      if (playPromiseRef.current) {
        playPromiseRef.current = null
      }
      video.pause()
      video.currentTime = 0
      video.load() // Reset the video element
    }
    
    setVideoUrl(null)
    setError(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIsLoading(false)
    setShowPlayOverlay(false)
    setPlaybackSpeed(1)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Raid Video - {cleanPlayerName(raidData?.player || raidData?.Attacking_Player_Name)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Watch the raid video with custom controls
          </DialogDescription>
        </DialogHeader>

        <div className="relative bg-black rounded-lg overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <span className="ml-2 text-white">Loading video...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-white">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">{error}</p>
                <Button 
                  onClick={loadVideoUrl}
                  className="mt-2"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {videoUrl && !isLoading && !error && (
            <>
              <div className="relative">
                <video
                  ref={videoRef}
                  id="raid-video"
                  className="w-full h-auto max-h-96"
                  controls={false}
                  preload="metadata"
                  muted={isMuted}
                  playsInline
                  autoPlay
                  crossOrigin="anonymous"
                  src={videoUrl}
                  onLoadedMetadata={(e) => {
                    console.log('Video metadata loaded')
                    handleVideoLoad(e)
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => {
                    console.log('Video started playing')
                    setIsPlaying(true)
                    setShowPlayOverlay(false)
                    setIsLoading(false)
                  }}
                  onPause={() => {
                    console.log('Video paused')
                    setIsPlaying(false)
                  }}
                  onEnded={() => {
                    console.log('Video ended')
                    setIsPlaying(false)
                  }}
                  onWaiting={() => {
                    console.log('Video waiting for data')
                    setIsLoading(true)
                  }}
                  onPlaying={() => {
                    console.log('Video is playing')
                    setIsLoading(false)
                  }}
                  onError={(e) => {
                    console.error('Video error:', e)
                    const video = e.target
                    const error = video.error
                    let errorMessage = 'Failed to load video'
                    
                    if (error) {
                      switch (error.code) {
                        case error.MEDIA_ERR_ABORTED:
                          errorMessage = 'Video loading was aborted'
                          break
                        case error.MEDIA_ERR_NETWORK:
                          errorMessage = 'Network error while loading video'
                          break
                        case error.MEDIA_ERR_DECODE:
                          errorMessage = 'Video format not supported'
                          break
                        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                          errorMessage = 'Video source not supported'
                          break
                        default:
                          errorMessage = 'Unknown video error'
                      }
                    }
                    
                    setError(errorMessage)
                  }}
                  onLoadStart={() => {
                    console.log('Video load started')
                    setIsLoading(true)
                  }}
                  onCanPlay={() => {
                    console.log('Video can play')
                    setIsLoading(false)
                  }}
                  onCanPlayThrough={() => {
                    console.log('Video can play through')
                    setIsLoading(false)
                  }}
                  onLoadedData={() => {
                    console.log('Video data loaded')
                    setIsLoading(false)
                  }}
                >
                  Your browser does not support the video tag.
                </video>

                {/* Play Overlay */}
                {showPlayOverlay && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Button
                      onClick={handlePlayPause}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      size="lg"
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Custom Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #6b7280 ${(currentTime / duration) * 100}%, #6b7280 100%)`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-white text-sm">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRestart}
                      className="text-white hover:bg-white/20"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>

                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMuteToggle}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />

                    {/* Playback Speed Selector */}
                    <div className="flex items-center space-x-1">
                      <Gauge className="h-4 w-4 text-white" />
                      <select
                        value={playbackSpeed}
                        onChange={(e) => handlePlaybackSpeedChange(parseFloat(e.target.value))}
                        className="bg-transparent text-white text-xs border border-white/30 rounded px-1 py-0.5 focus:outline-none focus:border-white/50"
                      >
                        <option value={0.25} className="bg-black text-white">0.25x</option>
                        <option value={0.5} className="bg-black text-white">0.5x</option>
                        <option value={0.75} className="bg-black text-white">0.75x</option>
                        <option value={1} className="bg-black text-white">1x</option>
                        <option value={1.25} className="bg-black text-white">1.25x</option>
                        <option value={1.5} className="bg-black text-white">1.5x</option>
                        <option value={1.75} className="bg-black text-white">1.75x</option>
                        <option value={2} className="bg-black text-white">2x</option>
                      </select>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Raid Information */}
        {raidData && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Raid Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                             <div>
                 <span className="text-gray-600">Player:</span>
                 <span className="ml-2 font-medium">{cleanPlayerName(raidData.player || raidData.Attacking_Player_Name)}</span>
               </div>
              <div>
                                        <span className="text-gray-600">Team:</span>
                        <div className="ml-2 flex items-center gap-2">
                          <TeamLogo teamCode={raidData.team || raidData.Attacking_Team_Code} size="sm" />
                          <span className="font-medium">{raidData.team || raidData.Attacking_Team_Code || 'Unknown'}</span>
                        </div>
              </div>
              <div>
                <span className="text-gray-600">Raid Number:</span>
                <span className="ml-2 font-medium">{raidData.raid_no || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{raidData.description || 'Raid Video'}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

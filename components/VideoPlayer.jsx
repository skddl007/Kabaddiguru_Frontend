"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, X, Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, AlertCircle } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

export default function VideoPlayer({ isOpen, onClose, raidId, raidData }) {
  const [videoUrl, setVideoUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    if (isOpen && (raidId || raidData?.video_url)) {
      loadVideoUrl()
    }
  }, [isOpen, raidId, raidData])

  const loadVideoUrl = async () => {
    // If raidData has video_url directly (analytics), use it
    if (raidData?.video_url && raidData.video_url !== "Video not available") {
      setVideoUrl(raidData.video_url)
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
  }

  const handleTimeUpdate = (event) => {
    const video = event.target
    setCurrentTime(video.currentTime)
  }

  const handlePlayPause = () => {
    const video = document.getElementById('raid-video')
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    const video = document.getElementById('raid-video')
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value)
    const video = document.getElementById('raid-video')
    if (video) {
      video.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const handleSeek = (event) => {
    const video = document.getElementById('raid-video')
    const seekTime = parseFloat(event.target.value)
    if (video) {
      video.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }

  const handleFullscreen = () => {
    const video = document.getElementById('raid-video')
    if (video) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        video.requestFullscreen()
      }
    }
  }

  const handleRestart = () => {
    const video = document.getElementById('raid-video')
    if (video) {
      video.currentTime = 0
      setCurrentTime(0)
      video.play()
      setIsPlaying(true)
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
    setVideoUrl(null)
    setError(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
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
              <video
                id="raid-video"
                className="w-full h-auto max-h-96"
                controls={false}
                onLoadedMetadata={handleVideoLoad}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

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
                <span className="ml-2 font-medium">{raidData.team || raidData.Attacking_Team_Code || 'Unknown'}</span>
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


import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Play } from "lucide-react";

type VideoModalProps = {
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
};

const VideoModal: React.FC<VideoModalProps> = ({
  thumbnailUrl,
  videoUrl,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer group rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <div className="aspect-video w-full max-w-3xl mx-auto relative">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <div className="h-16 w-16 rounded-md bg-white/90 flex items-center justify-center shadow-lg">
                <Play className="h-8 w-8 text-brightpair fill-brightpair" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-white font-medium">{title}</h3>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-1 bg-black">
        <div className="relative pt-[56.25%] w-full">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`${videoUrl}${isOpen ? '?autoplay=1' : ''}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;

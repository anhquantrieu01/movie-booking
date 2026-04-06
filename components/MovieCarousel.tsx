"use client";

import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
    children: React.ReactNode[];
    itemClassName?: string;
    autoplay?: boolean;
};

export default function MovieCarousel({
    children,
    itemClassName = "pl-4 basis-[200px]",
    autoplay = true,
}: Props) {
    const plugin = useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: true,
        })
    );

    return (
        <Carousel plugins={autoplay ? [plugin.current] : []} className="w-full">
            <CarouselContent className="-ml-4">

                {children.map((child, index) => (
                    <CarouselItem key={index} className={itemClassName}>
                        {child}
                    </CarouselItem>
                ))}

            </CarouselContent>

            <CarouselPrevious className="bg-black/60 backdrop-blur-md border border-red-500/40 text-red-500 
                hover:bg-red-600 hover:text-white hover:scale-110 
                shadow-lg shadow-red-600/20 rounded-full transition-all duration-300" />

            <CarouselNext className="bg-black/60 backdrop-blur-md border border-red-500/40 text-red-500 
                hover:bg-red-600 hover:text-white hover:scale-110 
                shadow-lg shadow-red-600/20 rounded-full transition-all duration-300" />
            </Carousel>
    );
}
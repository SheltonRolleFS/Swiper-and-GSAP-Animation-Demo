import type { GetStaticProps } from "next";
import { useRef, useEffect, SyntheticEvent } from "react";
import { fetchEntry } from "../functions/contentful";
import { PageProps } from "../types/interfaces";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import Slider from "../components/Slider";

const Home = ({ slider, animation }: PageProps) => {
    const canvasRef: HTMLCanvasElement | any = useRef<HTMLCanvasElement>();
    const sliderRef: HTMLDivElement | any = useRef<HTMLDivElement>();
    const imageProgress: number[] = [];

    const getFrameIndex = (progress: number, index: number): number => {
        if (index >= animation.fields.frames.length) return index;
        if (progress > imageProgress[index]) {
            return getFrameIndex(progress, index + 1);
        } else if (progress < imageProgress[index]) {
            return index;
        }

        return animation.fields.frames.length - 1;
    };

    const checkForCardUpdate = (
        frame: number,
        nextIndex: number,
        transitionSlideIndexes: number[],
        direction: number
    ) => {
        if (direction > 0) {
            if (frame >= transitionSlideIndexes[nextIndex]) {
                return true;
            } else {
                return false;
            }
        } else {
            if (frame <= transitionSlideIndexes[nextIndex]) {
                return true;
            } else {
                return false;
            }
        }
    };

    useEffect(() => {
        const frameWidth = 500;
        const frameHeight = 500;
        const numFrames = animation.fields.frames.length;
        const framesPerSlide = Math.floor(
            numFrames / slider.fields.slides.length
        );
        // We will use this array to hold the indexes that should trigger a slide transition
        const transitionSlideIndexes: number[] = [];
        for (let i = 0; i < numFrames; i++) {
            if (i % framesPerSlide === 0) transitionSlideIndexes.push(i);
        }

        const progressPerFrame = 1 / numFrames; // the number self.progress has to increase or decrease by to signify a frame change

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = frameWidth;
        canvas.height = frameHeight;

        const frameImages: HTMLImageElement[] = [];

        for (let i = 0; i < numFrames; i++) {
            const image = new Image();
            image.src = `https:${animation.fields.frames[i].fields.file.url}`;
            frameImages.push(image);
            imageProgress.push(progressPerFrame * (i + 1));
        }

        context.drawImage(frameImages[0], 0, 0, frameWidth, frameHeight);

        gsap.to(".slider", {
            scrollTrigger: {
                trigger: ".slider",
                start: "top top",
                end: "bottom top",
                markers: true,
                pin: true,
            },
        });

        gsap.to(".animation", {
            scrollTrigger: {
                trigger: ".animation",
                start: "top top",
                endTrigger: ".slider",
                markers: true,
                pin: true,
            },
        });

        let nextIndex = 1;
        gsap.to("#animation-canvas", {
            scrollTrigger: {
                trigger: "#animation-canvas",
                start: "top top",
                endTrigger: ".slider",
                onUpdate: async (self) => {
                    const frame = await getFrameIndex(self.progress, 0);

                    if (self.direction > 0) {
                        const updateCard = checkForCardUpdate(
                            frame,
                            nextIndex,
                            transitionSlideIndexes,
                            self.direction
                        );
                        if (updateCard) {
                            const slideNextEvent: any = new Event("slideNext");
                            slideNextEvent["nextIndex"] = nextIndex;
                            document.dispatchEvent(slideNextEvent);
                            if (nextIndex < transitionSlideIndexes.length - 1)
                                nextIndex++;
                        }
                    } else {
                        const updateCard = checkForCardUpdate(
                            frame,
                            nextIndex,
                            transitionSlideIndexes,
                            self.direction
                        );
                        if (updateCard) {
                            const slidePrevEvent: any = new Event("slidePrev");
                            slidePrevEvent["nextIndex"] = nextIndex;
                            document.dispatchEvent(slidePrevEvent);
                            if (nextIndex > 0) nextIndex--;
                        }
                    }

                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(
                        frameImages[frame],
                        0,
                        0,
                        frameWidth,
                        frameHeight
                    );
                },
            },
        });
    }, []);

    return (
        <div className="wrapper">
            <div ref={sliderRef} className="slider">
                <Slider slides={slider.fields.slides} />
            </div>
            <div className="animation">
                <canvas ref={canvasRef} id="animation-canvas" />
            </div>
        </div>
    );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
    // Get the slider and the animation frames
    const slider = await fetchEntry("4sbsxI7GoRNEr2IRX0t0nj");
    const animation = await fetchEntry("45fp0rixR7zWmUedosDRhl");
    return {
        props: {
            slider,
            animation,
        },
    };
};

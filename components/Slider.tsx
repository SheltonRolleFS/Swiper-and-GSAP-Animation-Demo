import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import { SliderProps } from "../types/interfaces";
import { Slide } from "./Slide";
import "swiper/css";
import { AnimationEventListener } from "./AnimationEventListener";
import { Navigation } from "swiper";

export default function Slider({ slides }: SliderProps) {
    return (
        <Swiper
            modules={[Navigation]}
            initialSlide={0}
            direction="horizontal"
            spaceBetween={50}
            slidesPerView={1}
            centeredSlides={true}
            onSwiper={(swiper) => console.log(swiper)}
        >
            {slides.map((slide, index) => {
                return (
                    <SwiperSlide key={index}>
                        <Slide content={slide.fields.content} />
                    </SwiperSlide>
                );
            })}
            <AnimationEventListener />
        </Swiper>
    );
}

import { useEffect } from "react";
import { useSwiper } from "swiper/react";

export const AnimationEventListener = () => {
    const swiper = useSwiper();

    const addListeners = () => {
        const slide = async (e: any) => {
            const nextIndex = e["nextIndex"];
            if (swiper.params !== undefined) {
                swiper.slideTo(nextIndex);
            }
        };

        document.addEventListener("slideNext", (e) => slide(e));
        document.addEventListener("slidePrev", (e) => slide(e));
    };

    const removeListeners = () => {
        document.removeEventListener("slideNext", () => {});
        document.removeEventListener("slidePrev", () => {});
    };

    useEffect(() => {
        addListeners();

        return () => {
            removeListeners();
        };
    }, []);

    return <></>;
};

export interface PageProps {
    slider: {
        fields: {
            slides: Slide[];
        };
    };
    animation: {
        fields: {
            frames: Frame[];
        };
    };
}

export interface Frame {
    fields: {
        file: {
            url: string;
        };
    };
}

export interface Slide {
    fields: {
        content: string;
    };
}

export interface SlideProps {
    content: string;
}

export interface SliderProps {
    slides: Slide[];
}

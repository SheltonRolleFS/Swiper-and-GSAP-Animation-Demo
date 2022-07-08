import { SlideProps } from "../types/interfaces";

export const Slide = ({ content }: SlideProps) => {
    return (
        <div className="slide">
            <h1>{content}</h1>
        </div>
    );
};

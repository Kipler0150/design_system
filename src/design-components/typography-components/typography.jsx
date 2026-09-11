import { useEffect, useState } from "react";
import "./typography.css";

const Typography = ({ onFontChange }) => {

    // Stores all fonts from imported-fonts.json
    const [fonts, setFonts] = useState([]);
    
    // Stores which font is currently selected
    const [currentFont, setCurrentFont] = useState(0);

    // For Animations
    const [animation, setAnimation] = useState(null);

     // Prevent repeated clicks
    const [isAnimating, setIsAnimating] = useState(false);

    const defaultFont = "Aa";

    useEffect(() => {
        async function fetchFonts() {
            try {
                const response = await fetch("./imported-fonts.json");
                if(!response.ok) {
                    throw new Error("Failed to load imported-fonts.json");
                }
                const data = await response.json();
                setFonts(data);
            } catch (error) {
                console.error("Error loading fonts:", error);
            }
        }
        fetchFonts();
    }, []);

    useEffect(() => {
        const selectedFont = fonts[currentFont];

        if (selectedFont) {
            onFontChange?.(selectedFont.family);
        }
    }, [fonts, currentFont, onFontChange]);

    // If fonts haven't loaded yet,
    if (fonts.length === 0) {
        return <p>Loading fonts...</p>;
    }

    // previous font (left font)
    const previousIndex =
        (currentFont - 1 + fonts.length)
        % fonts.length;

    // next font (right font)
    const nextIndex =
        (currentFont + 1)
        % fonts.length;

    // Get the previous, current, and next font objects
    const previous =
        fonts[previousIndex];

    // Get the current font object
    const current =
        fonts[currentFont];

    // Get the next font object
    const next =
        fonts[nextIndex];

    // Change font upon left or right button click
    const changeFont = (direction) => {
        if (isAnimating) return; // Prevent repeated clicks

        setIsAnimating(true);
        setAnimation(direction);

        setTimeout(() => {
             if (direction === "next") {
                setCurrentFont(prev => {
                    return (prev + 1) % fonts.length;
                });
            }
            else {
                setCurrentFont(prev => {
                    return (
                        prev - 1 + fonts.length
                    ) % fonts.length;
                });
            }
        }, 200);

        setTimeout(() => {
            setAnimation(null);
            setIsAnimating(false);
        }, 450);

    }

    return (
        <div className="mainItem fontDesign">
            <div className="fontDesignContainer fontDesignTitle">
                <h2 className="sectionTitle">TYPOGRAPHY</h2>
                <hr></hr>
            </div>
            
            <div className="fontDesignContainer fontDesignSelector">
                {/* Font Selector */}
                <div className={`fontSelector ${animation ? `${animation}--animation` : ""}`}>
                    {/* Previous Font */}
                    <div className="fontOption" 
                        id="previousFont" 
                        style={{fontFamily: previous.family}}>
                        {defaultFont}
                        </div>
                        

                    {/* Previous button */}
                    <button className="font-arrow" 
                        id="previousButton" 
                        type="button" 
                        onClick={() => changeFont("previous")} 
                        disabled={isAnimating}>
                    </button>

                    {/* Selected Font */}
                    <div className="selectedFontContainer">
                        <div className="selectedFont">
                            <span
                            id="currentFont"
                            style={{ fontFamily: current.family }}
                            >
                            {defaultFont}
                            </span>
                        </div>

                        <p className="selectedFontName" style={{fontFamily: current.family}}>{current.name}</p>
                    </div>

                    {/* Next button */}
                    <button className="font-arrow" 
                        id="nextButton"
                        onClick={() => changeFont("next")} 
                        disabled={isAnimating}>
                    </button>

                    {/* Next font */}
                    <div className="fontOption" 
                        id="nextFont"
                        style={{fontFamily: next.family}}>
                        {defaultFont}
                    </div>
                </div>
            </div>

            <div className="fontDesignContainer fontDesignSizes">
                <h2 className="sectionTitle">SIZES</h2>
                <hr></hr>
                <div className="fontSizes" style={{fontFamily: current.family}}>
                    <p>PARAGRAPH</p>
                    <h4>HEADER 4</h4>
                    <h3>HEADER 3</h3>
                    <h2>HEADER 2</h2>
                    <h1>HEADER 1</h1>
                </div>
            </div>
        </div>
    )
}

export default Typography;
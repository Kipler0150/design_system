import { useRef, useState } from "react";
import "./color-wheel.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const rgbToHex = (red, green, blue) => `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;

const hexToRgb = (value) => {
    const normalizedValue = value.replace("#", "");
    if (!/^[\da-f]{6}$/i.test(normalizedValue)) return null;

    return [
        parseInt(normalizedValue.slice(0, 2), 16),
        parseInt(normalizedValue.slice(2, 4), 16),
        parseInt(normalizedValue.slice(4, 6), 16),
    ];
};

const hsvToRgb = (hue, saturation, brightness) => {
    const saturationValue = saturation / 100;
    const brightnessValue = brightness / 100;
    const chroma = brightnessValue * saturationValue;
    const segment = hue / 60;
    const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
    const match = brightnessValue - chroma;
    let channels;

    if (segment < 1) channels = [chroma, secondary, 0];
    else if (segment < 2) channels = [secondary, chroma, 0];
    else if (segment < 3) channels = [0, chroma, secondary];
    else if (segment < 4) channels = [0, secondary, chroma];
    else if (segment < 5) channels = [secondary, 0, chroma];
    else channels = [chroma, 0, secondary];

    return channels.map((channel) => Math.round((channel + match) * 255));
};

const rgbToHsv = (red, green, blue) => {
    const channels = [red, green, blue].map((channel) => channel / 255);
    const max = Math.max(...channels);
    const min = Math.min(...channels);
    const difference = max - min;
    let hue = 0;

    if (difference !== 0) {
        if (max === channels[0]) hue = 60 * (((channels[1] - channels[2]) / difference) % 6);
        else if (max === channels[1]) hue = 60 * ((channels[2] - channels[0]) / difference + 2);
        else hue = 60 * ((channels[0] - channels[1]) / difference + 4);
    }

    return {
        hue: (hue + 360) % 360,
        saturation: max === 0 ? 0 : (difference / max) * 100,
        brightness: max * 100,
    };
};

const parseColor = (value) => {
    const rgbMatch = value.match(/rgb\(\s*(\d+)\s*[ ,]\s*(\d+)\s*[ ,]\s*(\d+)/i);
    if (rgbMatch) return rgbToHsv(...rgbMatch.slice(1, 4).map(Number));

    const hslMatch = value.match(/hsl\(\s*([\d.]+).*?([\d.]+)%.*?([\d.]+)%/i);
    if (hslMatch) {
        const hue = Number(hslMatch[1]);
        const saturation = Number(hslMatch[2]) / 100;
        const lightness = Number(hslMatch[3]) / 100;
        const brightness = lightness + saturation * Math.min(lightness, 1 - lightness);
        const hsvSaturation = brightness === 0 ? 0 : 2 * (1 - lightness / brightness) * 100;

        return { hue, saturation: hsvSaturation, brightness: brightness * 100 };
    }

    return { hue: 0, saturation: 100, brightness: 100 };
};

const ColorWheel = ({ value = "hsl(0 100% 50%)", onChange }) => {
    const squareRef = useRef(null);
    const hueRef = useRef(null);
    const initialColor = parseColor(value);
    const [hue, setHue] = useState(initialColor.hue);
    const [saturation, setSaturation] = useState(initialColor.saturation);
    const [brightness, setBrightness] = useState(initialColor.brightness);
    const [colorMode, setColorMode] = useState("rgb");

    const [red, green, blue] = hsvToRgb(hue, saturation, brightness);
    const hexValue = rgbToHex(red, green, blue);
    const updateColor = (nextHue, nextSaturation, nextBrightness) => {
        setHue(nextHue);
        setSaturation(nextSaturation);
        setBrightness(nextBrightness);
        onChange?.(`rgb(${hsvToRgb(nextHue, nextSaturation, nextBrightness).join(", ")})`);
    };

    const updateSquare = (event) => {
        const square = squareRef.current;
        if (!square) return;

        const bounds = square.getBoundingClientRect();
        const nextSaturation = clamp(((event.clientX - bounds.left) / bounds.width) * 100, 0, 100);
        const nextBrightness = clamp(100 - ((event.clientY - bounds.top) / bounds.height) * 100, 0, 100);

        updateColor(hue, nextSaturation, nextBrightness);
    };

    const updateHue = (event) => {
        const hueBar = hueRef.current;
        if (!hueBar) return;

        const bounds = hueBar.getBoundingClientRect();
        const nextHue = clamp(((event.clientX - bounds.left) / bounds.width) * 360, 0, 360);
        updateColor(nextHue, saturation, brightness);
    };

    const capturePointer = (event, update) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        update(event);
    };

    const updateRgbChannel = (channel, nextValue) => {
        const channels = { red, green, blue, [channel]: clamp(Number(nextValue) || 0, 0, 255) };
        const nextColor = rgbToHsv(channels.red, channels.green, channels.blue);
        updateColor(nextColor.hue, nextColor.saturation, nextColor.brightness);
    };

    const updateHexValue = (nextValue) => {
        const channels = hexToRgb(nextValue);
        if (!channels) return;

        const nextColor = rgbToHsv(...channels);
        updateColor(nextColor.hue, nextColor.saturation, nextColor.brightness);
    };

    return (
        <div className="colorWheelPanel">
            <div
                ref={squareRef}
                className="colorSquare"
                role="slider"
                aria-label="Choose saturation and brightness"
                onPointerDown={(event) => capturePointer(event, updateSquare)}
                onPointerMove={(event) => {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                        updateSquare(event);
                    }
                }}
                style={{ "--selected-hue": `${hue}deg` }}
            >
                <div
                    className="colorSquareMarker"
                    style={{ left: `${saturation}%`, top: `${100 - brightness}%` }}
                />
            </div>

            <div className="colorHueLabel">
                <span>Hue</span>
                <span>{Math.round(hue)}°</span>
            </div>

            <div
                ref={hueRef}
                className="colorHueBar"
                role="slider"
                aria-label="Choose hue"
                onPointerDown={(event) => capturePointer(event, updateHue)}
                onPointerMove={(event) => {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) updateHue(event);
                }}
            >
                <div className="colorHueMarker" style={{ left: `${(hue / 360) * 100}%` }} />
            </div>

            <select
                className="colorMode"
                aria-label="Color format"
                value={colorMode}
                onChange={(event) => setColorMode(event.target.value)}
            >
                <option value="rgb">RGB</option>
                <option value="hex">HEX</option>
            </select>

            {colorMode === "rgb" ? (
                <div className="colorValueInputs">
                    {[['red', red], ['green', green], ['blue', blue]].map(([channel, channelValue]) => (
                        <input
                            key={channel}
                            type="number"
                            min="0"
                            max="255"
                            value={channelValue}
                            aria-label={channel}
                            onChange={(event) => updateRgbChannel(channel, event.target.value)}
                        />
                    ))}
                </div>
            ) : (
                <input
                    className="colorHexInput"
                    type="text"
                    value={hexValue}
                    maxLength="7"
                    aria-label="Hex color"
                    onChange={(event) => updateHexValue(event.target.value)}
                />
            )}
        </div>
    );
};

export default ColorWheel;

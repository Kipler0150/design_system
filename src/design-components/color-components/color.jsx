import { useState } from "react";
import "./color.css";
import ColorWheel from "../color-wheel/color-wheel";

const Color = () => {
  const [primaryColor, setPrimaryColor] = useState("hsl(0 100% 50%)");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ left: 0, top: 0 });

  const openPrimaryPicker = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const pickerWidth = 304;
    const pickerHeight = 470;
    const left = Math.min(box.left, window.innerWidth - pickerWidth - 12);
    const belowTop = box.bottom + 8;
    const top = belowTop + pickerHeight <= window.innerHeight
      ? belowTop
      : Math.max(12, box.top - pickerHeight - 8);

    setPickerPosition({
      left: Math.max(12, left),
      top,
    });
    setIsPickerOpen(true);
  };

  return (
  <>
    <div className="mainItem colorDesign">
      <div className="colorDesignContainer colorDesignTitle">
        <h2 className="sectionTitle">COLOR</h2>
        <hr></hr>
      </div>

      <div className="colorDesignContainer primaryColor">  
        <button
          className="boxColor"
          id="primary"
          type="button"
          aria-label="Choose primary color"
          style={{ background: primaryColor }}
          onClick={openPrimaryPicker}
        ></button>
        <h2>Primary Color</h2>
      </div>
      <div className="colorDesignContainer secondaryColor">  
        <div className="boxColor" id="secondary"></div>
        <h2>Secondary Color</h2>
      </div>
      <div className="colorDesignContainer primaryFontColor">  
        <div className="boxColor" id="primaryFont"></div>
        <h2>Primary Font Color</h2>
      </div>
      <div className="colorDesignContainer secondaryFontColor">  
        <div className="boxColor" id="secondaryFont"></div>
        <h2>Secondary Font Color</h2>
      </div>
    </div>

    {isPickerOpen && (
      <div
        className="pickerOverlay"
        onClick={() => setIsPickerOpen(false)}
      >
        <div
          className="pickerModal"
          style={{ left: pickerPosition.left, top: pickerPosition.top }}
          onClick={(event) => event.stopPropagation()}
        >
          <ColorWheel value={primaryColor} onChange={setPrimaryColor} />
          <button
            className="pickerClose"
            type="button"
            onClick={() => setIsPickerOpen(false)}
          >
            Done
          </button>
        </div>
      </div>
    )}
  </>
  )
}

export default Color
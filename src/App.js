import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

const ColorBox = ({ color, frequency }) => (
  <tr className="text-center">
    <td className="py-2">
    <div className="py-2 h-10 w-10 rounded-lg mr-2" style={{ backgroundColor: color }} />
    </td>
    <td className="py-2">{color}</td>
    <td className="py-2">{frequency}</td>
  </tr>
);

export default function App() {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const image = new Image();
      image.src = reader.result;
      image.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        const colorCounts = {};
        for (let i = 0; i < pixelData.length; i += 4) {
          const r = pixelData[i];
          const g = pixelData[i + 1];
          const b = pixelData[i + 2];
          const color = `rgb(${r}, ${g}, ${b})`;
          if (colorCounts[color]) {
            colorCounts[color].frequency++;
          } else {
            colorCounts[color] = { frequency: 1 };
          }
        }
        const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b].frequency - colorCounts[a].frequency);
        const topColors = sortedColors.slice(0, 60).map((color) => ({ color, frequency: colorCounts[color].frequency }));
        setColors(topColors);
      };
      setImage(reader.result);
    };
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="font-semibold text-3xl mb-8 m-5">Color Frequency Chart</h1>
      <div className="flex flex-col items-center">
        {image ? (
          <>
            <img src={image} alt="Uploaded" className="mb-4 rounded-lg" />
            {colors && (
              <div className="flex flex-col items-center">
                <h2 className="font-semibold text-lg mb-4">Color Palette</h2>
                <table className="table-auto rounded-lg">
                  <thead>
                    <tr className="text-center">
                      <th className="py-2">Color</th>
                      <th className="py-2">Code</th>
                      <th className="py-2">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colors.map(({ color, frequency }) => (
                      <ColorBox color={color} frequency={frequency} key={color} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <label className="flex flex-col items-center cursor-pointer">
            <FiUpload className="text-4xl mb-2" />
            <span>Upload an image</span>
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
        )}
      </div>
    </div>
  );
}